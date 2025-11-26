const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

// Test rider credentials
const mobile = '9900000001'
const pidgeId = 'TEST001'
const email = `${mobile}@rider.shreejientserv.in`

console.log('Testing login for:', email)
console.log('Password should be:', pidgeId)

// Try to create/update auth user
const userData = {
    email: email,
    password: pidgeId,
    email_confirm: true,
    user_metadata: { role: 'rider' }
}

const data = JSON.stringify(userData)

const options = {
    hostname: baseUrl,
    port: 443,
    path: '/auth/v1/admin/users',
    method: 'POST',
    headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}

const req = https.request(options, (res) => {
    let responseData = ''
    res.on('data', (chunk) => { responseData += chunk })
    res.on('end', () => {
        console.log('Status:', res.statusCode)
        console.log('Response:', responseData)
    })
})

req.on('error', (e) => console.error('Error:', e))
req.write(data)
req.end()
