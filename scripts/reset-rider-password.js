const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

const userId = 'c14ccc59-519f-46bb-8941-3061a40381d6'
const newPassword = 'TEST001'

const data = JSON.stringify({ password: newPassword })

const options = {
    hostname: baseUrl,
    port: 443,
    path: `/auth/v1/admin/users/${userId}`,
    method: 'PUT',
    headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}

console.log(`Resetting password for user ${userId} to: ${newPassword}`)

const req = https.request(options, (res) => {
    let responseData = ''
    res.on('data', (chunk) => { responseData += chunk })
    res.on('end', () => {
        console.log('Status:', res.statusCode)
        if (res.statusCode === 200) {
            console.log('✅ Password reset successful!')
            console.log('Login with: 9900000001 / TEST001')
        } else {
            console.log('Response:', responseData)
        }
    })
})

req.on('error', (e) => console.error('Error:', e))
req.write(data)
req.end()
