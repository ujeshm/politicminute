import Link from 'next/link'
import { Plus, User, Shield } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { deleteUser } from './actions'

export default async function UsersPage() {
    const supabase = await createClient()

    // 1. Check if current user is super_admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <div>Unauthenticated</div>

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'super_admin') {
        return (
            <div className="text-center py-20">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Access Denied</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Only Super Admins can manage users.</p>
            </div>
        )
    }

    // 2. Fetch all users/profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) {
        console.error("Error fetching profiles:", error)
        return <div className="p-4 text-red-500">Error loading users: {error.message} - {error.details}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage team members and their roles.</p>
                </div>
                <Link
                    href="/dashboard/users/add"
                    className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
                    {profiles?.map((profile: any) => (
                        <li key={profile.id} className="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="min-w-0">
                                <div className="flex items-start gap-x-3">
                                    <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{profile.full_name}</p>
                                    <p className={`rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${profile.role === 'super_admin' ? 'text-purple-700 bg-purple-50 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400/30' :
                                        profile.role === 'minute_keeper' ? 'text-green-700 bg-green-50 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/30' :
                                            'text-blue-700 bg-blue-50 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30'
                                        }`}>
                                        {profile.role.replace('_', ' ')}
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                    <p className="truncate">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-none items-center gap-x-4">
                                {profile.id !== user.id && ( // Prevent self-deletion
                                    <form action={async () => {
                                        'use server'
                                        await deleteUser(profile.id)
                                    }}>
                                        <button
                                            type="submit"
                                            className="text-sm font-semibold text-red-600 hover:text-red-500"
                                        // Add simple confirmation if possible, but for server actions in form, JS is needed for confirm().
                                        // For now, simple button. 
                                        >
                                            Delete
                                        </button>
                                    </form>
                                )}
                            </div>
                        </li>
                    ))}
                    {profiles?.length === 0 && (
                        <li className="py-10 text-center text-gray-500">No users found.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
