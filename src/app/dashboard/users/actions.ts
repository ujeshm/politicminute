'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    // 1. Verify current user is Super Admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'super_admin') {
        return { error: 'Unauthorized' }
    }

    // 2. Create User using Admin Client
    // Check if we have the key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
        return { error: 'Server configuration error: Service Key missing. Cannot create users.' }
    }

    const adminClient = createAdminClient()

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (createError) {
        console.error('Error creating user:', createError)
        return { error: createError.message }
    }

    if (!newUser.user) {
        return { error: 'Failed to create user object.' }
    }

    // 3. Update Profile with Role
    // The profile might have been auto-created by a trigger on auth.users insert.
    // If so, we just need to update it. If not, we insert it.
    // Assuming we have a trigger 'on_auth_user_created' that inserts into profiles.
    // Usually triggers run immediately. Let's try to update.

    const { error: updateError } = await adminClient
        .from('profiles')
        .update({ role: role, full_name: fullName })
        .eq('id', newUser.user.id)

    if (updateError) {
        console.error('Error updating profile role:', updateError)
        return { error: 'User created but failed to set role: ' + updateError.message }
    }

    revalidatePath('/dashboard/users')
    redirect('/dashboard/users')
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Authorization Check
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    if (currentUserProfile?.role !== 'super_admin') {
        return { error: 'Unauthorized' }
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { error: 'Server configuration error: Service Key missing.' }
    }

    const adminClient = createAdminClient()

    // 2. Delete User from Auth (Cascade deletes profile)
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) {
        console.error("Error deleting user:", error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/users')
}
