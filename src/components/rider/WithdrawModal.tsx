'use client'

import { useState } from 'react'

interface WithdrawModalProps {
    isOpen: boolean
    onClose: () => void
    balance: number
    onWithdraw: (amount: number) => Promise<void>
}

export default function WithdrawModal({ isOpen, onClose, balance, onWithdraw }: WithdrawModalProps) {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const withdrawAmount = parseFloat(amount)
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        if (withdrawAmount > balance) {
            setError('Insufficient balance')
            return
        }

        setLoading(true)
        try {
            await onWithdraw(withdrawAmount)
            onClose()
            setAmount('')
        } catch (err: any) {
            setError(err.message || 'Withdrawal failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold text-purple-600">₹{balance.toFixed(2)}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount to Withdraw
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0.00"
                                min="1"
                                max={balance}
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || balance <= 0}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Withdraw'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
