'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function createMinute(formData: FormData) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const meeting_date = formData.get('meeting_date') as string
    const meeting_time = formData.get('meeting_time') as string
    const attendeesRaw = formData.get('attendees') as string
    const agenda = formData.get('agenda') as string
    const discussion = formData.get('discussion') as string
    const decisions = formData.get('decisions') as string

    // Basic parsing for attendees (comma separated)
    const attendees = attendeesRaw.split(',').map(a => a.trim()).filter(a => a)

    const { error } = await supabase.from('minutes').insert({
        title,
        meeting_date,
        meeting_time,
        attendees,
        agenda,
        discussion,
        decisions,
        author_id: user.id
    })

    if (error) {
        console.error('Error creating minute:', error)
        // In a real app, handle error specifically (return to form with error)
        throw new Error('Failed to create minute')
    }

    revalidatePath('/dashboard/minutes')
    redirect('/dashboard/minutes')
}

export async function deleteMinute(minuteId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthenticated' }

    // 1. Authorization Check (Super Admin or Author)
    // We fetch the profile to check for super_admin.
    // We also need to check if the user is the author if they are NOT super_admin, 
    // but the RLS might handle "author delete" if we set it up.
    // However, the request is specifically "Super Admin must be able to delete minute".

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isSuperAdmin = currentUserProfile?.role === 'super_admin'

    if (!isSuperAdmin) {
        // Optional: Allow authors to delete their own minutes? 
        // For now, let's strictly follow "Super Admin must be able to delete".
        // If we want authors to delete, we'd check author_id.
        return { error: 'Unauthorized: Only Super Admins can delete minutes.' }
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { error: 'Server configuration error: Service Key missing.' }
    }

    const adminClient = createAdminClient()

    const { error } = await adminClient
        .from('minutes')
        .delete()
        .eq('id', minuteId)

    if (error) {
        console.error("Error deleting minute:", error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/minutes')
    redirect('/dashboard/minutes')
}
