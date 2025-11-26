'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sendOTP, verifyOTP } from '@/lib/otp'

export default function RiderLoginPage() {
    const router = useRouter()
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [tempSession, setTempSession] = useState<any>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const supabase = createClient()

            // Login with email/password
            const email = mobile.includes('@') ? mobile : `${mobile}@rider.shreejientserv.in`

            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (loginError) {
                setError('Invalid mobile number or password')
                setLoading(false)
                return
            }

            // Check if user is a rider
            const userRole = data.user?.user_metadata?.role
            if (userRole !== 'rider') {
                await supabase.auth.signOut()
                setError('This login is for riders only')
                setLoading(false)
                return
            }

            // Send OTP for 2FA - REMOVED (paid service)
            // Redirect directly to dashboard
            router.push('/rider/dashboard')
        } catch (err: any) {
            // Fallback: Try logging in with mobile number as password
            try {
                const fallbackResult = await supabase.auth.signInWithPassword({
                    email,
                    password: mobile
                })

                if (fallbackResult.error) throw fallbackResult.error

                // Fallback login successful
                router.push('/rider/dashboard')
            } catch (fallbackErr: any) {
                setError('Invalid mobile number or password')
            }
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
            const otpResult = await verifyOTP(mobile, otp)

            if (otpResult.success) {
                // OTP verified, proceed to dashboard
                router.push('/rider/dashboard')
            } else {
                setError('Invalid OTP. Please try again.')
            }
        } catch (err: any) {
            setError(err.message || 'Verification failed')
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
                    <h1 className="text-3xl font-bold text-gray-900">Rider Login</h1>
                    <p className="text-gray-600 mt-2">Access your earnings dashboard</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {step === 'credentials' ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-center">
                                <Link href="/rider/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                                    Forgot Password?
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify OTP</h2>
                                <p className="text-gray-600 mb-4">
                                    We've sent a 6-digit OTP to <strong>{mobile}</strong>
                                </p>
                            </div>

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
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('credentials')}
                                className="w-full text-purple-600 py-2 font-medium hover:text-purple-700"
                            >
                                ← Back to Login
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center border-t pt-6">
                        <p className="text-gray-600">
                            New rider?{' '}
                            <Link href="/rider/register" className="text-purple-600 font-semibold hover:text-purple-700">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Help */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need help? Call{' '}
                        <a href="tel:+917016899689" className="text-purple-600 font-semibold">
                            +91-7016899689
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
