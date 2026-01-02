export default function TestEnvPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY

    return (
        <div className="p-10 font-mono">
            <h1>Environment Check</h1>
            <p>URL: {url ? 'Present' : 'MISSING'}</p>
            <p>ANON: {anon ? 'Present' : 'MISSING'}</p>
            <p>SERVICE: {service ? 'Present' : 'MISSING'}</p>
        </div>
    )
}
