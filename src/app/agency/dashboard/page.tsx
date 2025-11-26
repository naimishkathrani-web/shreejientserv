'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Rider, Agency } from '@/types/database'

export default function AgencyDashboard() {
    const [agency, setAgency] = useState<Agency | null>(null)
    const [riders, setRiders] = useState<Rider[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalRiders: 0,
        activeRiders: 0,
        totalEarnings: 0,
    })

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/agency/login')
                    return
                }

                // Fetch agency details
                const { data: agencyData, error: agencyError } = await supabase
                    .from('agencies')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (agencyError) {
                    console.error('Agency error:', agencyError)
                    throw agencyError
                }

                setAgency(agencyData)

                // Fetch linked riders
                const { data: ridersData, error: ridersError } = await supabase
                    .from('riders')
                    .select('*')
                    .eq('agency_id', agencyData.id)
                    .order('created_at', { ascending: false })

                if (ridersError) throw ridersError
                setRiders(ridersData || [])

                // Calculate stats
                const active = ridersData?.filter(r => r.status === 'active').length || 0
                setStats({
                    totalRiders: ridersData?.length || 0,
                    activeRiders: active,
                    totalEarnings: 0, // Placeholder
                })
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error)
                alert('Error loading dashboard: ' + error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/agency/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg"><span className="text-2xl">🏢</span></div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{agency?.name || 'Agency'}</h1>
                            <p className="text-sm text-gray-500">Agency Dashboard</p>
                        </div>
                    </div>
                    <button onClick={handleSignOut} className="text-sm text-gray-600 hover:text-red-600 font-medium">Sign Out</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Riders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalRiders}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg"><span className="text-2xl">👥</span></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Riders</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeRiders}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg"><span className="text-2xl">✅</span></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">₹{stats.totalEarnings}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg"><span className="text-2xl">💰</span></div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link href="/agency/riders/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                            <span>➕</span> Add New Rider
                        </Link>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <span>📢</span> View Campaigns
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City / Hub</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {riders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No riders found. Start adding riders to earn commissions!
                                    </td>
                                </tr>
                            ) : (
                                riders.map(rider => (
                                    <tr key={rider.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{rider.first_name} {rider.last_name}</div>
                                            <div className="text-xs text-gray-500">{rider.pidge_rider_id || 'No ID'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{rider.mobile}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{rider.city || '-'} / {rider.hub || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rider.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    rider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {rider.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(rider.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}
