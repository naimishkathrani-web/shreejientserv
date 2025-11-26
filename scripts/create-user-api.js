const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'

// Create user via Supabase Admin API
const userData = JSON.stringify({
    email: '9900000020@rider.shreejientserv.in',
    password: 'rider123',
    email_confirm: true,
    user_metadata: {
        role: 'rider'
    }
})

const options = {
    hostname: 'ynuiitgsmudgxaolvhhj.supabase.co',
    port: 443,
    path: '/auth/v1/admin/users',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': userData.length,
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
    }
}

console.log('🚀 Creating test rider via Supabase Admin API...')

const req = https.request(options, (res) => {
    let data = ''

    res.on('data', (chunk) => {
        data += chunk
    })

    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            const user = JSON.parse(data)
            console.log('✅ User created successfully!')
            console.log('   User ID:', user.id)
            console.log('   Email:', user.email)
            console.log('\n📱 LOGIN CREDENTIALS:')
            console.log('   Mobile: 9900000020')
            console.log('   Password: rider123')
            console.log('   OTP: 123456')
            console.log('\n🔗 Next: Create rider record in database')
            console.log(`   User ID to use: ${user.id}`)
        } else {
            console.log('❌ Error:', res.statusCode)
            console.log(data)
        }
    })
})

req.on('error', (error) => {
    console.error('❌ Request error:', error)
})

req.write(userData)
req.end()
