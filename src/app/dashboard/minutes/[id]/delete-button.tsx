'use client'

import { deleteMinute } from '../actions'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DeleteMinuteButton({ minuteId }: { minuteId: string }) {
    const [canDelete, setCanDelete] = useState(false)

    useEffect(() => {
        async function checkRole() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
                if (data?.role === 'super_admin') {
                    setCanDelete(true)
                }
            }
        }
        checkRole()
    }, [])

    if (!canDelete) return null

    return (
        <form action={async () => {
            if (confirm("Are you sure you want to delete this minute? This action cannot be undone.")) {
                await deleteMinute(minuteId)
            }
        }}>
            <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                <Trash className="w-4 h-4 mr-2" />
                Delete
            </button>
        </form>
    )
}
