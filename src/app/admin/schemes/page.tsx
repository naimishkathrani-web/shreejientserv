'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Scheme {
    id: string
    name: string
    description: string | null
    vendor_fee_type: string
    vendor_fee_value: number
    rider_payout_config: any
    is_active: boolean
    created_at: string
}

export default function SchemesPage() {
    const [schemes, setSchemes] = useState<Scheme[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchSchemes()
    }, [])

    const fetchSchemes = async () => {
        try {
            const { data, error } = await supabase
                .from('schemes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setSchemes(data || [])
        } catch (error) {
            console.error('Error fetching schemes:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleSchemeStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('schemes')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchSchemes()
        } catch (error) {
            console.error('Error updating scheme:', error)
        }
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
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                                ← Back
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Scheme Management</h1>
                                <p className="text-sm text-gray-500 mt-1">Configure client programs and payout schemes</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/schemes/new"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <span>➕</span> Add Scheme
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Schemes</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{schemes.length}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <span className="text-2xl">📋</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Schemes</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {schemes.filter(s => s.is_active).length}
                                </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Inactive Schemes</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">
                                    {schemes.filter(s => !s.is_active).length}
                                </p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                                <span className="text-2xl">⛔</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schemes.map((scheme) => (
                        <div key={scheme.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{scheme.description || 'No description'}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${scheme.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {scheme.is_active ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">Vendor Fee Type</span>
                                    <span className="text-sm font-medium text-gray-900 capitalize">{scheme.vendor_fee_type}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">Vendor Fee Value</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {scheme.vendor_fee_type === 'percentage' ? `${scheme.vendor_fee_value}%` : `₹${scheme.vendor_fee_value}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600">Created</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(scheme.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href={`/admin/schemes/${scheme.id}`}
                                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium"
                                >
                                    Edit Details
                                </Link>
                                <button
                                    onClick={() => toggleSchemeStatus(scheme.id, scheme.is_active)}
                                    className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${scheme.is_active
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {scheme.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {schemes.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Schemes Yet</h3>
                        <p className="text-gray-500 mb-6">Create your first scheme to start managing client programs</p>
                        <Link
                            href="/admin/schemes/new"
                            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Add First Scheme
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
