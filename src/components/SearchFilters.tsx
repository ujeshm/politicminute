'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search, Calendar, User, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function SearchFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [authors, setAuthors] = useState<{ id: string, full_name: string }[]>([])
    const [attendeeOptions, setAttendeeOptions] = useState<string[]>([])

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            // Fetch potential minute keepers (profiles)
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, full_name')
                .order('full_name')

            if (profileData) {
                setAuthors(profileData)
            }

            // Fetch all unique attendees from existing minutes
            const { data: minutesData } = await supabase
                .from('minutes')
                .select('attendees')

            if (minutesData) {
                const allAttendees = minutesData.flatMap(m => m.attendees || [])
                const uniqueAttendees = Array.from(new Set(allAttendees)).sort()
                setAttendeeOptions(uniqueAttendees)
            }
        }
        fetchData()
    }, [])

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleDate = (date: string) => {
        const params = new URLSearchParams(searchParams)
        if (date) {
            params.set('date', date)
        } else {
            params.delete('date')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const handleAuthor = (authorId: string) => {
        const params = new URLSearchParams(searchParams)
        if (authorId) {
            params.set('author', authorId)
        } else {
            params.delete('author')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const handleAttendee = (attendee: string) => {
        const params = new URLSearchParams(searchParams)
        if (attendee) {
            params.set('attendee', attendee)
        } else {
            params.delete('attendee')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        replace(pathname)
    }

    const hasFilters = searchParams.get('query') || searchParams.get('date') || searchParams.get('attendee') || searchParams.get('author')

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Search</label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search title..."
                        className="pl-9 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get('query')?.toString()}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</label>
                <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="date"
                        className="pl-9 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                        onChange={(e) => handleDate(e.target.value)}
                        defaultValue={searchParams.get('date')?.toString()}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Minute Keeper</label>
                <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <select
                        className="pl-9 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                        onChange={(e) => handleAuthor(e.target.value)}
                        value={searchParams.get('author')?.toString() || ''}
                    >
                        <option value="">All Keepers</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Attendee</label>
                <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <select
                        className="pl-9 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                        onChange={(e) => handleAttendee(e.target.value)}
                        value={searchParams.get('attendee')?.toString() || ''}
                    >
                        <option value="">All Attendees</option>
                        {attendeeOptions.map((att, idx) => (
                            <option key={idx} value={att}>
                                {att}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                </button>
            )}
        </div>
    )
}
