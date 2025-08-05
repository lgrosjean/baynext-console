'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'


export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error(error)
    }, [error])

    const isProjectNotFound = error.message.toLowerCase().includes('project') && 
        (error.message.toLowerCase().includes('not exist') || 
         error.message.toLowerCase().includes('not found'))

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <div className="space-x-4">
                    {isProjectNotFound && (
                        <button
                            onClick={() => router.push('/app/projects')}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Go back to projects
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}