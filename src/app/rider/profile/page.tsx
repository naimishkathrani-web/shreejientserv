'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Rider } from '@/types/database'
import Link from 'next/link'

export default function RiderProfile() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [rider, setRider] = useState<Rider | null>(null)

    useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/rider/login')
            return
        }

        const { data } = await supabase
            .from('riders')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (data) setRider(data)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!rider) return null

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-4">
                    <Link href="/rider/dashboard" className="text-gray-600 hover:text-gray-900">
                        ← Back
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                    <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center text-4xl mb-4">
                        👤
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{rider.first_name} {rider.last_name}</h2>
                    <p className="text-gray-500 text-sm mt-1">Rider ID: {rider.pidge_rider_id || 'Pending'}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {rider.status.toUpperCase()}
                    </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Personal Details</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-4 flex justify-between">
                            <span className="text-gray-500 text-sm">Mobile</span>
                            <span className="font-medium text-gray-900">{rider.mobile}</span>
                        </div>
                        <div className="p-4 flex justify-between">
                            <span className="text-gray-500 text-sm">Work Location</span>
                            <span className="font-medium text-gray-900">{rider.work_location || '-'}</span>
                        </div>
                        <div className="p-4 flex justify-between">
                            <span className="text-gray-500 text-sm">Joined On</span>
                            <span className="font-medium text-gray-900">
                                {new Date(rider.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Bank Details</h3>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Encrypted 🔒
                        </span>
                    </div>
                    <div className="p-4 text-center text-gray-500 text-sm">
                        Bank details are securely stored and encrypted.
                        <br />
                        Contact support to update.
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={async () => {
                        const supabase = createClient()
                        await supabase.auth.signOut()
                        router.push('/rider/login')
                    }}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
