'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex h-screen flex-col items-center justify-center bg-white text-black">
                    <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                    <p className="mb-6 font-mono text-sm bg-gray-100 p-2 rounded">{error.message}</p>
                    <button
                        onClick={() => reset()}
                        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
