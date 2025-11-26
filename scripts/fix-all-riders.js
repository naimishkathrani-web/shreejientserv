const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

async function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: baseUrl,
            port: 443,
            path: path,
            method: method,
            headers: {
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        }

        if (data) {
            const body = JSON.stringify(data)
            options.headers['Content-Length'] = Buffer.byteLength(body)
        }

        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => { responseData += chunk })
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData))
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

async function fixAllRiders() {
    console.log('🔧 Fixing all rider data...\n')

    // Get all auth users
    const authResponse = await makeRequest('GET', '/auth/v1/admin/users')
    const authUsers = authResponse.users || []
    console.log(`Found ${authUsers.length} auth users`)

    // Get all riders
    const riders = await makeRequest('GET', '/rest/v1/riders?select=*')
    console.log(`Found ${riders.length} riders\n`)

    let fixed = 0

    for (const rider of riders) {
        const authUser = authUsers.find(u => u.email === rider.email)

        if (authUser) {
            // Update rider with user_id
            const updated = await makeRequest('PATCH', `/rest/v1/riders?id=eq.${rider.id}`, {
                user_id: authUser.id
            })

            if (updated && updated.length > 0) {
                fixed++
                console.log(`✅ ${fixed}/${riders.length} - Fixed: ${rider.first_name} ${rider.last_name} (${rider.pidge_rider_id})`)
            }
        } else {
            console.log(`⚠️  No auth user for: ${rider.email}`)
        }
    }

    console.log(`\n✅ Complete! Fixed ${fixed}/${riders.length} riders`)
    console.log(`\n🧪 Test login: 9900028536 / 28536`)
}

fixAllRiders().catch(console.error)
