const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'

async function apiRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ynuiitgsmudgxaolvhhj.supabase.co',
      port: 443,
      path,
      method,
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation'
      }
    }

    if (data) {
      const jsonData = JSON.stringify(data)
      options.headers['Content-Type'] = 'application/json'
      options.headers['Content-Length'] = jsonData.length
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => { responseData += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData ? JSON.parse(responseData) : null)
        } else {
          reject(new Error(`${res.statusCode}: ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    if (data) req.write(JSON.stringify(data))
    req.end()
  })
}

async function fixAgencyLogin() {
  console.log('🔧 Fixing agency login...\n')
  
  try {
    // Get agency user ID
    const users = await apiRequest('GET', '/auth/v1/admin/users')
    const agencyUser = users.users.find(u => u.email === 'agency@test.com')
    
    if (!agencyUser) {
      console.log('❌ Agency user not found in auth.users')
      return
    }
    
    console.log('✓ Found agency user:', agencyUser.id)
    
    // Check if agency record exists
    const agencies = await apiRequest('GET', `/rest/v1/agencies?user_id=eq.${agencyUser.id}`)
    
    if (agencies && agencies.length > 0) {
      console.log('✓ Agency record already exists')
      console.log('\n✅ Agency login should work now!')
      console.log('   Email: agency@test.com')
      console.log('   Password: agency123')
      return
    }
    
    // Create agency record
    const agencyData = {
      user_id: agencyUser.id,
      name: 'Test Recruitment Agency',
      contact_person: 'Rajesh Kumar',
      mobile: '9876543210',
      email: 'agency@test.com',
      bank_account_number: '1234567890123456',
      bank_ifsc: 'HDFC0001234',
      bank_name: 'HDFC Bank',
      status: 'active'
    }
    
    await apiRequest('POST', '/rest/v1/agencies', agencyData)
    
    console.log('✅ Agency record created successfully!')
    console.log('\n📱 AGENCY LOGIN:')
    console.log('   Email: agency@test.com')
    console.log('   Password: agency123')
    console.log('   URL: http://localhost:3000/agency/login')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

fixAgencyLogin()
