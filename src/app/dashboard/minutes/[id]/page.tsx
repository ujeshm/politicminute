import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import DeleteMinuteButton from './delete-button'

interface MinuteDetailPageProps {
    params: {
        id: string
    }
}

export default async function MinuteDetailPage({ params }: MinuteDetailPageProps) {
    const supabase = await createClient()

    const { data: minute } = await supabase
        .from('minutes')
        .select(`
            *,
            author:author_id (full_name, email)
        `)
        .eq('id', params.id)
        .single()

    if (!minute) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <Link href="/dashboard/minutes" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Minutes
                    </Link>

                    {/* Delete Button (Server-side check would be better, but we need client interactivity for confirmation usually. 
                        Here we use a form actions for simplicity or checking role again.) 
                    */}
                    <div className="flex gap-2">
                        {/* We need to know if the current user is super_admin. We can fetch it again or pass it up. */}
                        <DeleteMinuteButton minuteId={minute.id} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{minute.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(minute.meeting_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {minute.meeting_time}
                    </div>
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {minute.author?.full_name || minute.author?.email || 'Unknown'}
                    </div>
                </div>
            </div>

            {/* Attendees */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Attendees</h2>
                <div className="flex flex-wrap gap-2">
                    {minute.attendees?.map((attendee: string, index: number) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm">
                            {attendee.trim()}
                        </span>
                    ))}
                    {(!minute.attendees || minute.attendees.length === 0) && (
                        <span className="text-gray-500 italic">No attendees listed</span>
                    )}
                </div>
            </div>

            {/* Sections (Agenda, Discussion, Decisions) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">

                {/* Agenda */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        Agenda
                    </h2>
                    <div
                        className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: minute.agenda || '<p>No agenda provided.</p>' }}
                    />
                </div>

                {/* Discussion */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        Discussion
                    </h2>
                    <div
                        className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: minute.discussion || '<p>No discussion recorded.</p>' }}
                    />
                </div>

                {/* Decisions */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        Decisions Made
                    </h2>
                    <div
                        className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: minute.decisions || '<p>No decisions recorded.</p>' }}
                    />
                </div>

            </div>
        </div>
    )
}
