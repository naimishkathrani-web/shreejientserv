const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

// Check rider
const options = {
    hostname: baseUrl,
    port: 443,
    path: '/rest/v1/riders?mobile=eq.9900000001&select=*',
    method: 'GET',
    headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
    }
}

const req = https.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => { data += chunk })
    res.on('end', () => {
        const riders = JSON.parse(data)
        console.log('Rider data:', JSON.stringify(riders, null, 2))

        if (riders.length > 0 && riders[0].user_id) {
            console.log('\nUser ID exists:', riders[0].user_id)
            console.log('Now checking auth.users...')

            // Check auth user
            const authOptions = {
                hostname: baseUrl,
                port: 443,
                path: `/auth/v1/admin/users/${riders[0].user_id}`,
                method: 'GET',
                headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`
                }
            }

            const authReq = https.request(authOptions, (authRes) => {
                let authData = ''
                authRes.on('data', (chunk) => { authData += chunk })
                authRes.on('end', () => {
                    console.log('Auth user:', authData)
                })
            })
            authReq.end()
        } else {
            console.log('No user_id found - rider not linked to auth user')
        }
    })
})

req.end()
