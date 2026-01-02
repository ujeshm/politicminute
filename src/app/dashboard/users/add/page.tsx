'use client'

import { createUser } from '../actions'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddUserPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        // We can't directly assign the result of the server action to state if it redirects.
        // But if it returns an error, we can capture it.
        // We need to wrap it.
        const result = await createUser(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // If success, it redirects, so no need to setLoading(false) really.
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
                        Add New User
                    </h2>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {error && (
                    <div className="bg-red-50 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                    <div className="sm:col-span-6">
                        <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="fullName"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Initial Password
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Role
                        </label>
                        <div className="mt-2">
                            <select
                                name="role"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            >
                                <option value="member">Viewer (Member)</option>
                                <option value="minute_editor">Editor (Minute Editor)</option>
                                <option value="minute_keeper">Minute Keeper</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-gray-700 pt-8">
                    <Link
                        href="/dashboard/users"
                        className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </div>

            </form>
        </div>
    )
}
