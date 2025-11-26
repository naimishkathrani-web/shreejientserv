'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ContractPage() {
    const [accepted, setAccepted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAccept = async () => {
        if (!accepted) return
        setSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/rider/register')
                return
            }

            // Update rider record
            const { error } = await supabase
                .from('riders')
                .update({
                    contract_accepted_at: new Date().toISOString(),
                    contract_version: '1.0'
                })
                .eq('user_id', user.id)

            if (error) throw error

            router.push('/rider/register/documents')
        } catch (error) {
            console.error('Error accepting contract:', error)
            alert('Error accepting contract. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Rider Agreement</h2>
                    <p className="mt-2 text-sm text-gray-600">Please read and accept the terms to proceed</p>
                </div>

                <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-6 bg-gray-50 text-sm text-gray-700 space-y-4">
                    <h3 className="font-bold text-lg">1. Independent Contractor Relationship</h3>
                    <p>You acknowledge that you are an independent contractor and not an employee of Shreeji Enterprise Services.</p>

                    <h3 className="font-bold text-lg">2. Services</h3>
                    <p>You agree to provide delivery services in a timely and professional manner, adhering to all traffic laws and safety regulations.</p>

                    <h3 className="font-bold text-lg">3. Compensation</h3>
                    <p>Payment will be made based on the agreed-upon rates per delivery or distance. Payments are subject to deductions for penalties or damages as per company policy.</p>

                    <h3 className="font-bold text-lg">4. Equipment</h3>
                    <p>You are responsible for providing and maintaining your own vehicle and smartphone required for the services.</p>

                    <h3 className="font-bold text-lg">5. Confidentiality</h3>
                    <p>You agree to keep all customer information and company data confidential.</p>

                    <h3 className="font-bold text-lg">6. Termination</h3>
                    <p>Either party may terminate this agreement with notice. Immediate termination may occur for violation of terms.</p>

                    <p className="italic text-gray-500 mt-4">Version 1.0 - Effective Nov 2025</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <input
                        id="accept-terms"
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="accept-terms" className="text-sm font-medium text-gray-900">
                        I have read and agree to the Terms and Conditions
                    </label>
                </div>

                <button
                    onClick={handleAccept}
                    disabled={!accepted || submitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Processing...' : 'Accept & Continue'}
                </button>
            </div>
        </div>
    )
}
