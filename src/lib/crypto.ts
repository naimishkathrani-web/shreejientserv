import CryptoJS from 'crypto-js'

// Encryption key - In production, store in environment variable
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'shreeji-secure-key-2025'

/**
 * Encrypt sensitive data (Aadhar, PAN, Bank details)
 */
export function encrypt(text: string): string {
    if (!text) return ''
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

/**
 * Decrypt sensitive data
 */
export function decrypt(ciphertext: string): string {
    if (!ciphertext) return ''
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * Hash data (one-way, for verification only)
 */
export function hash(text: string): string {
    return CryptoJS.SHA256(text).toString()
}

/**
 * Mask sensitive data for display
 */
export function maskAadhar(aadhar: string): string {
    if (!aadhar || aadhar.length !== 12) return aadhar
    return `XXXX XXXX ${aadhar.slice(-4)}`
}

export function maskPAN(pan: string): string {
    if (!pan || pan.length !== 10) return pan
    return `${pan.slice(0, 3)}XXXX${pan.slice(-3)}`
}

export function maskBankAccount(account: string): string {
    if (!account || account.length < 4) return account
    return `XXXX${account.slice(-4)}`
}

export function maskMobile(mobile: string): string {
    if (!mobile || mobile.length !== 10) return mobile
    return `${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`
}
