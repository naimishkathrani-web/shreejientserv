'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Scheme } from '@/types/database'

export default function AgencyAddRiderPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [schemes, setSchemes] = useState<Scheme[]>([])
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        city: '',
        hub: '',
        schemeId: ''
    })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSchemes = async () => {
            const { data } = await supabase
                .from('schemes')
                .select('*')
                .eq('is_active', true)

            if (data) {
                setSchemes(data)
                // Set default scheme if available (e.g., Regular Scheme)
                const regular = data.find(s => s.name === 'Regular Scheme')
                if (regular) {
                    setFormData(prev => ({ ...prev, schemeId: regular.id }))
                } else if (data.length > 0) {
                    setFormData(prev => ({ ...prev, schemeId: data[0].id }))
                }
            }
        }
        fetchSchemes()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Get Current Agency ID
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data: agency } = await supabase
                .from('agencies')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!agency) throw new Error('Agency profile not found')

            // 2. Create Rider
            const { data: rider, error: riderError } = await supabase
                .from('riders')
                .insert({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    mobile: formData.mobile,
                    city: formData.city,
                    hub: formData.hub,
                    agency_id: agency.id,
                    current_scheme_id: formData.schemeId,
                    status: 'pending',
                    wallet_balance: 0
                })
                .select()
                .single()

            if (riderError) throw riderError

            // 3. Create Contract Entry (Pending)
            await supabase
                .from('rider_contracts')
                .insert({
                    rider_id: rider.id,
                    contract_type: 'new',
                    acceptance_date: new Date().toISOString().split('T')[0],
                    status: 'pending'
                })

            // 4. Create Scheme History
            await supabase
                .from('rider_scheme_history')
                .insert({
                    rider_id: rider.id,
                    scheme_id: formData.schemeId,
                    start_date: new Date().toISOString().split('T')[0]
                })

            router.push('/agency/dashboard')
            router.refresh()

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Add New Rider</h2>
                    <Link href="/agency/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                        Cancel
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            placeholder="9876543210"
                            value={formData.mobile}
                            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hub</label>
                            <input
                                type="text"
                                required
                                value={formData.hub}
                                onChange={e => setFormData({ ...formData, hub: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Scheme</label>
                        <select
                            value={formData.schemeId}
                            onChange={e => setFormData({ ...formData, schemeId: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        >
                            {schemes.map(scheme => (
                                <option key={scheme.id} value={scheme.id}>
                                    {scheme.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Determines the rider's payout structure.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating Rider...' : 'Create Rider Account'}
                    </button>
                </form>
            </div>
        </div>
    )
}
