'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createMinute } from '../actions'
import Editor from '@/components/Editor'

interface NewMinuteFormProps {
    userEmail: string
    userName?: string
    userRole?: string
}

export default function NewMinuteForm({ userEmail, userName, userRole }: NewMinuteFormProps) {
    const [agenda, setAgenda] = useState('')
    const [discussion, setDiscussion] = useState('')
    const [decisions, setDecisions] = useState('')

    const now = new Date()
    // Format: YYYY-MM-DD
    const currentDate = now.toISOString().split('T')[0]
    // Format: HH:MM
    const currentTime = now.toTimeString().slice(0, 5)

    return (
        <div className="max-w-3xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
                        Create New Minute
                    </h2>
                </div>
            </div>

            <form action={createMinute} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                    {/* Minute Taker (Read-only) */}
                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Minute Taker
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                disabled
                                value={userName || userEmail}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Logged in as: <span className="font-semibold">{userRole || 'member'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-6">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Meeting Title
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                                placeholder="e.g. Daily Standup"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="sm:col-span-3">
                        <label htmlFor="meeting_date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Date
                        </label>
                        <div className="mt-2">
                            <input
                                type="date"
                                name="meeting_date"
                                id="meeting_date"
                                required
                                defaultValue={currentDate}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="sm:col-span-3">
                        <label htmlFor="meeting_time" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Time
                        </label>
                        <div className="mt-2">
                            <input
                                type="time"
                                name="meeting_time"
                                id="meeting_time"
                                required
                                defaultValue={currentTime}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div className="sm:col-span-6">
                        <label htmlFor="attendees" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Attendees (comma separated)
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="attendees"
                                id="attendees"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                                placeholder="John Doe, Jane Smith..."
                            />
                        </div>
                    </div>

                    {/* Agenda */}
                    <div className="sm:col-span-6">
                        <label htmlFor="agenda" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Agenda
                        </label>
                        <div className="mt-2">
                            <Editor value={agenda} onChange={setAgenda} placeholder="Key points to discuss..." />
                            <input type="hidden" name="agenda" value={agenda} />
                        </div>
                    </div>

                    {/* Discussion */}
                    <div className="sm:col-span-6">
                        <label htmlFor="discussion" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Discussion
                        </label>
                        <div className="mt-2">
                            <Editor value={discussion} onChange={setDiscussion} placeholder="Detailed notes..." />
                            <input type="hidden" name="discussion" value={discussion} />
                        </div>
                    </div>

                    {/* Decisions */}
                    <div className="sm:col-span-6">
                        <label htmlFor="decisions" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Decisions Made
                        </label>
                        <div className="mt-2">
                            <Editor value={decisions} onChange={setDecisions} placeholder="Decisions agreed upon..." />
                            <input type="hidden" name="decisions" value={decisions} />
                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-gray-700 pt-8">
                    <Link
                        href="/dashboard/minutes"
                        className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save Minute
                    </button>
                </div>
            </form>
        </div>
    )
}
