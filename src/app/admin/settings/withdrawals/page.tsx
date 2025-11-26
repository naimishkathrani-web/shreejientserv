'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function WithdrawalSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dailyLimit, setDailyLimit] = useState(500)
    const [fullWithdrawalDay, setFullWithdrawalDay] = useState('thursday')
    const [message, setMessage] = useState('')

    const router = useRouter()
    const supabase = createClient()

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'withdrawal_daily_limit')
                .single()

            if (error) throw error

            if (data) {
                setDailyLimit(data.value.amount)
                setFullWithdrawalDay(data.value.full_withdrawal_day)
            }
        } catch (error: any) {
            console.error('Error loading settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage('')

        try {
            const { data: { user } } = await supabase.auth.getUser()

            const { error } = await supabase
                .from('system_settings')
                .upsert({
                    key: 'withdrawal_daily_limit',
                    value: { amount: dailyLimit, full_withdrawal_day: fullWithdrawalDay },
                    updated_by: user?.id
                })

            if (error) throw error

            setMessage('Settings saved successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error: any) {
            setMessage('Error: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700 flex items-center gap-2">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Settings</h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Daily Withdrawal Limit (₹)
                            </label>
                            <input
                                type="number"
                                value={dailyLimit}
                                onChange={(e) => setDailyLimit(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                min="0"
                                step="100"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Maximum amount riders can withdraw per day (except on full withdrawal day)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Withdrawal Day
                            </label>
                            <select
                                value={fullWithdrawalDay}
                                onChange={(e) => setFullWithdrawalDay(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent capitalize"
                            >
                                {days.map(day => (
                                    <option key={day} value={day} className="capitalize">{day}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                Day when riders can withdraw their full available balance
                            </p>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                            <Link
                                href="/admin/dashboard"
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Current Settings Summary</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Daily limit: ₹{dailyLimit}</li>
                            <li>• Full withdrawal day: {fullWithdrawalDay.charAt(0).toUpperCase() + fullWithdrawalDay.slice(1)}</li>
                            <li>• Riders can withdraw up to ₹{dailyLimit} on regular days</li>
                            <li>• On {fullWithdrawalDay}s, riders can withdraw their full available balance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
