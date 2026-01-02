import { createMinute } from '../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NewMinuteForm from './form'

export default async function NewMinutePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role === 'member') {
        redirect('/dashboard/minutes')
    }

    return (
        <NewMinuteForm
            userEmail={user.email || ''}
            userName={profile?.full_name}
            userRole={profile?.role}
        />
    )
}
