import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    Minute Project
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    The daily minuting platform for your efficient team.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/login"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Get started
                    </Link>
                    <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                        Log in <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
