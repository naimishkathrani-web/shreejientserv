'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sendOTP, verifyOTP } from '@/lib/otp'
import { encrypt } from '@/lib/crypto'

export default function RiderRegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState<'details' | 'otp'>('details')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        aadharNumber: '',
        panNumber: '',
        workLocation: ''
    })

    const [otp, setOtp] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName) {
            setError('Please enter your full name')
            return false
        }

        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            setError('Please enter a valid 10-digit mobile number')
            return false
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return false
        }

        return true
    }

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setError('')

        try {
            // Send OTP
            const result = await sendOTP(formData.mobile)

            if (result.success) {
                setStep('otp')
            } else {
                setError(result.error || 'Failed to send OTP')
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()

        if (otp.length !== 6) {
            setError('Please enter 6-digit OTP')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Verify OTP
            const otpResult = await verifyOTP(formData.mobile, otp)

            if (!otpResult.success) {
                setError('Invalid OTP. Please try again.')
                setLoading(false)
                return
            }

            // Create Supabase auth user
            const supabase = createClient()
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email || `${formData.mobile}@rider.shreejientserv.in`,
                password: formData.password,
                options: {
                    data: {
                        role: 'rider',
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        mobile: formData.mobile
                    }
                }
            })

            if (authError) {
                setError(authError.message)
                setLoading(false)
                return
            }

            // Create rider profile
            const { error: riderError } = await supabase.from('riders').insert({
                user_id: authData.user?.id,
                mobile: formData.mobile,
                email: formData.email || null,
                first_name: formData.firstName,
                last_name: formData.lastName,
                aadhar_number: formData.aadharNumber ? encrypt(formData.aadharNumber) : null,
                pan_number: formData.panNumber ? encrypt(formData.panNumber) : null,
                work_location: formData.workLocation || null,
                status: 'pending'
            })

            if (riderError) {
                setError(riderError.message)
                setLoading(false)
                return
            }

            // Success! Redirect to dashboard
            router.push('/rider/dashboard')

        } catch (err: any) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src="/images/logo.jpg" alt="Shreeji" className="h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900">Join as Rider</h1>
                    <p className="text-gray-600 mt-2">Start earning with Shreeji Enterprise Services</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {step === 'details' ? (
                        <form onSubmit={handleSubmitDetails} className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Work Location *
                                </label>
                                <input
                                    type="text"
                                    name="workLocation"
                                    value={formData.workLocation}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Rajkot, Ahmedabad"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Aadhar Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="aadharNumber"
                                    value={formData.aadharNumber}
                                    onChange={handleInputChange}
                                    placeholder="12-digit Aadhar number"
                                    maxLength={12}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    PAN Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleInputChange}
                                    placeholder="10-character PAN"
                                    maxLength={10}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Minimum 8 characters"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Sending OTP...' : 'Continue'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify Mobile</h2>

                            <p className="text-gray-600 mb-4">
                                We've sent a 6-digit OTP to <strong>{formData.mobile}</strong>
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Verifying...' : 'Verify & Register'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('details')}
                                className="w-full text-purple-600 py-2 font-medium hover:text-purple-700"
                            >
                                ← Back to Details
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/rider/login" className="text-purple-600 font-semibold hover:text-purple-700">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
