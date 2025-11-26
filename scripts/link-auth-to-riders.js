const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: baseUrl,
            port: 443,
            path: path,
            method: method,
            headers: {
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
            }
        }

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data))
        }

        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => { responseData += chunk })
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData)
                    resolve(parsed)
                } catch (e) {
                    resolve(responseData)
                }
            })
        })

        req.on('error', reject)
        if (data) req.write(JSON.stringify(data))
        req.end()
    })
}

async function linkAuthToRiders() {
    console.log('🔗 Linking auth users to rider records...\n')

    // Get all riders
    const riders = await makeRequest('GET', '/rest/v1/riders?select=id,email,pidge_rider_id,first_name')
    console.log(`Found ${riders.length} riders in database`)

    // Get all auth users
    const authUsers = await makeRequest('GET', '/auth/v1/admin/users')
    console.log(`Found ${authUsers.users?.length || 0} auth users`)

    let linked = 0

    for (const rider of riders) {
        const authUser = authUsers.users?.find(u => u.email === rider.email)
        if (authUser && authUser.id) {
            // Update rider with user_id
            await makeRequest('PATCH', `/rest/v1/riders?id=eq.${rider.id}`, {
                user_id: authUser.id
            })
            linked++
            console.log(`✅ Linked: ${rider.first_name} (${rider.pidge_rider_id})`)
        }
    }

    console.log(`\n✅ Complete! Linked ${linked}/${riders.length} riders`)
}

linkAuthToRiders().catch(console.error)
