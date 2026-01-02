import Link from 'next/link'
import { Plus, Calendar, Clock, User, FileText } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import SearchFilters from '@/components/SearchFilters'

export default async function MinutesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string
        date?: string
        attendee?: string
        author?: string
    }
}) {
    const supabase = await createClient()
    let query = supabase
        .from('minutes')
        .select('*, profiles(full_name)')
        .order('meeting_date', { ascending: false })

    if (searchParams?.query) {
        query = query.or(`title.ilike.%${searchParams.query}%,agenda.ilike.%${searchParams.query}%,discussion.ilike.%${searchParams.query}%`)
    }

    if (searchParams?.date) {
        query = query.eq('meeting_date', searchParams.date)
    }

    if (searchParams?.attendee) {
        // Attendees is a text array in the database.
        query = query.contains('attendees', [searchParams.attendee])
    }

    if (searchParams?.author) {
        query = query.eq('author_id', searchParams.author)
    }

    const { data: minutes, error } = await query

    if (error) {
        console.error(error)
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch current user's role
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    const canCreate = currentUserProfile?.role && ['super_admin', 'minute_keeper', 'minute_editor'].includes(currentUserProfile.role)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meeting Minutes</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and view all daily meeting records.</p>
                </div>
                {canCreate && (
                    <Link
                        href="/dashboard/minutes/new"
                        className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <Plus className="h-4 w-4" />
                        Add Minute
                    </Link>
                )}
            </div>

            <SearchFilters />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {minutes?.map((minute: any) => (
                    <Link
                        key={minute.id}
                        href={`/dashboard/minutes/${minute.id}`}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
                                        Minute
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(minute.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                {minute.title}
                            </h3>
                            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>{new Date(minute.meeting_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{minute.meeting_time}</span>
                                </div>
                                {/* 
                  Since we are querying with `profiles(full_name)`, Type generation might not pick it up correctly 
                  without explicit types. For now we assume safety or use "Unknown Author".
                */}
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>Author: {minute.profiles?.full_name || 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 dark:bg-gray-800/50 dark:border-gray-700">
                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">View Details &rarr;</span>
                        </div>
                    </Link>
                ))}
                {(!minutes || minutes.length === 0) && (
                    <div className="col-span-full py-12 text-center">
                        <div className="text-gray-400 mb-3">
                            <FileText className="h-12 w-12 mx-auto opacity-20" />
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No minutes found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new meeting minute.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Local FileText component removed as it is imported from lucide-react
