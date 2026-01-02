import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Total Minutes Count
    const { count: totalMinutes } = await supabase
        .from('minutes')
        .select('*', { count: 'exact', head: true })

    // 2. Fetch Minutes This Month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { count: minutesThisMonth } = await supabase
        .from('minutes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth)

    // 3. Pending Actions (Placeholder for now as we don't have detailed action item tracking yet)
    // We could check for action items that are not "done" if we had that structure.
    const pendingActions = 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Minutes */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Minutes</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalMinutes || 0}</p>
                </div>
                {/* Monthly Stats */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</h3>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">{minutesThisMonth || 0}</p>
                </div>
                {/* Pending Actions */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Actions</h3>
                    <p className="mt-2 text-3xl font-bold text-orange-500">{pendingActions}</p>
                    <p className="text-xs text-gray-400 mt-1">(Coming soon)</p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                    No recent activity to show.
                </div>
            </div>
        </div>
    )
}
