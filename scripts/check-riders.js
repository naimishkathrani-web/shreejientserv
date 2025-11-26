const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

const options = {
    hostname: baseUrl,
    port: 443,
    path: '/rest/v1/riders?select=pidge_rider_id,mobile,first_name&limit=5',
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
        console.log(JSON.parse(data))
    })
})

req.on('error', (e) => console.error(e))
req.end()
