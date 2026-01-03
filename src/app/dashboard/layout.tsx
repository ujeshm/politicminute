import Link from 'next/link'
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    Users
} from 'lucide-react'
// Actions
import { signOut } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isSuperAdmin = profile?.role === 'super_admin'

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            {/* Sidebar for Desktop */}
            <aside className="hidden w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:flex">
                <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700 px-6">
                    <Link href="/dashboard" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        Minute Project
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    <NavLink href="/dashboard" icon={LayoutDashboard}>
                        Dashboard
                    </NavLink>
                    <NavLink href="/dashboard/minutes" icon={FileText}>
                        All Minutes
                    </NavLink>
                    {isSuperAdmin && (
                        <NavLink href="/dashboard/users" icon={Users}>
                            Users
                        </NavLink>
                    )}
                    <NavLink href="/dashboard/settings" icon={Settings}>
                        Settings
                    </NavLink>
                </nav>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <form action={signOut}>
                        <button className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                    <div className="mt-4 flex items-center gap-3 px-4 text-sm text-gray-500">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate font-medium">{user.user_metadata.full_name || 'User'}</p>
                            <p className="truncate text-xs">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 md:hidden">
                    <Link href="/dashboard" className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        Minute Project
                    </Link>
                    <button className="text-gray-500">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

function NavLink({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    )
}
