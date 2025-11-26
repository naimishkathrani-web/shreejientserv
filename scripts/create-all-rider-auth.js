const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

// All 79 riders from performance data
const riders = [
    { mobile: '9900028536', password: '28536', name: 'Mahendra Gupta' },
    { mobile: '9900028553', password: '28553', name: 'Hemat Mukar' },
    { mobile: '9900028590', password: '28590', name: 'Rohit Niranjan' },
    { mobile: '9900029717', password: '29717', name: 'Dilip Jha' },
    { mobile: '9900030028', password: '30028', name: 'Muzammil Syed' },
    { mobile: '9900030968', password: '30968', name: 'Suraj Gupta' },
    { mobile: '9900030970', password: '30970', name: 'Sahil Zende' },
    { mobile: '9900031733', password: '31733', name: 'Prdip Gupta' },
    { mobile: '9900031831', password: '31831', name: 'Arvindkumar Gupta' },
    { mobile: '9900031901', password: '31901', name: 'Vijay Kumar' },
    { mobile: '9900032141', password: '32141', name: 'Vinay Gupta' },
    { mobile: '9900032398', password: '32398', name: 'Rajkumar Puchairampal' },
    { mobile: '9900032584', password: '32584', name: 'Suraj Singh' },
    { mobile: '9900032754', password: '32754', name: 'Ram Karan' },
    { mobile: '9900033285', password: '33285', name: 'Nazim Umarshah' },
    { mobile: '9900033503', password: '33503', name: 'Vishnu Vishnu' },
    { mobile: '9900033531', password: '33531', name: 'Priyanshu Chavda' },
    { mobile: '9900033621', password: '33621', name: 'Mdshakir Ahmedkhateeb' },
    { mobile: '9900033623', password: '33623', name: 'Sachin Sachin' },
    { mobile: '9900033673', password: '33673', name: 'Imran Kasani' },
    { mobile: '9900033700', password: '33700', name: 'Jaiashish Kumar' },
    { mobile: '9900033797', password: '33797', name: 'Vijay Saroj' },
    { mobile: '9900033833', password: '33833', name: 'Deepanshu Deepanshu' },
    { mobile: '9900034121', password: '34121', name: 'Vinod Maurya' },
    { mobile: '9900034200', password: '34200', name: 'Sahariaj Islam' },
    { mobile: '9900034265', password: '34265', name: 'Rafik Attar' },
    { mobile: '9900034305', password: '34305', name: 'MdArman Khan' },
    { mobile: '9900034499', password: '34499', name: 'Md Asif' },
    { mobile: '9900034586', password: '34586', name: 'Salahuddin Khan' },
    { mobile: '9900034591', password: '34591', name: 'Ganesh Rajput' },
    { mobile: '9900034869', password: '34869', name: 'Akash Mokate' },
    { mobile: '9900034960', password: '34960', name: 'Sadarealam Sadarealam' },
    { mobile: '9900034976', password: '34976', name: 'Sandeep Yadav' },
    { mobile: '9900035024', password: '35024', name: 'Dharmveer Singh' },
    { mobile: '9900035121', password: '35121', name: 'Rahul Jee' },
    { mobile: '9900035225', password: '35225', name: 'Rakesh Prajapati' },
    { mobile: '9900035252', password: '35252', name: 'Amol Chaudhari' },
    { mobile: '9900035268', password: '35268', name: 'Mohammed Jahangir' },
    { mobile: '9900035302', password: '35302', name: 'Rohan Rohan' },
    { mobile: '9900035352', password: '35352', name: 'Abdul Ahmed' },
    { mobile: '9900035360', password: '35360', name: 'Ravindra Kinjawade' },
    { mobile: '9900035393', password: '35393', name: 'Suraj Gupta' },
    { mobile: '9900035418', password: '35418', name: 'Pankaj Verma' },
    { mobile: '9900035473', password: '35473', name: 'Swapnil Farade' },
    { mobile: '9900035474', password: '35474', name: 'Rupesh Bhalerao' },
    { mobile: '9900035499', password: '35499', name: 'Suraj Kannaujiya' },
    { mobile: '9900035534', password: '35534', name: 'Md Aslam' },
    { mobile: '9900035625', password: '35625', name: 'Vijaykumar Sah' },
    { mobile: '9900035630', password: '35630', name: 'Md Islam' },
    { mobile: '9900035646', password: '35646', name: 'Abdul Alim' },
    { mobile: '9900035672', password: '35672', name: 'Pradeep Singh' },
    { mobile: '9900035674', password: '35674', name: 'Rohit Sakate' },
    { mobile: '9900035679', password: '35679', name: 'Santosh Vajantri' },
    { mobile: '9900035690', password: '35690', name: 'Amit Talekar' },
    { mobile: '9900035726', password: '35726', name: 'Jayesh Chauhan' },
    { mobile: '9900035764', password: '35764', name: 'Tushar Deshmukh' },
    { mobile: '9900035835', password: '35835', name: 'Prashant Kothale' },
    { mobile: '9900035837', password: '35837', name: 'VipinKumar Bhurtiya' },
    { mobile: '9900035840', password: '35840', name: 'Surendra Gupta' },
    { mobile: '9900035846', password: '35846', name: 'Akshar Bhanushali' },
    { mobile: '9900035868', password: '35868', name: 'Vijay Jadhav' },
    { mobile: '9900035897', password: '35897', name: 'Kaustubh Jamale' },
    { mobile: '9900035910', password: '35910', name: 'Abbas Ansari' },
    { mobile: '9900035953', password: '35953', name: 'Sandeep Sandeepyadav' },
    { mobile: '9900035955', password: '35955', name: 'Vishal Gupta' },
    { mobile: '9900036006', password: '36006', name: 'Ranjeet Verma' },
    { mobile: '9900036029', password: '36029', name: 'Saurabh Saurabh' },
    { mobile: '9900036106', password: '36106', name: 'Surendra Gupta' },
    { mobile: '9900036107', password: '36107', name: 'Deepak Gholap' },
    { mobile: '9900036176', password: '36176', name: 'Harikesh Yadav' },
    { mobile: '9900036186', password: '36186', name: 'Vikas Shinde' },
    { mobile: '9900036260', password: '36260', name: 'Babluddin Mansuri' },
    { mobile: '9900036303', password: '36303', name: 'Imran Parkar' },
    { mobile: '9900036323', password: '36323', name: 'Dilip Patel' },
    { mobile: '9900036326', password: '36326', name: 'Sandeep Kumar' },
    { mobile: '9900036328', password: '36328', name: 'Ankit Ankit' },
    { mobile: '9900036352', password: '36352', name: 'Sandeep Yaduvanshi' },
    { mobile: '9900036359', password: '36359', name: 'Amar Chauhan' },
    { mobile: '9900036401', password: '36401', name: 'Shivam Mishra' },
    { mobile: '9900036465', password: '36465', name: 'Amitkumar Yadav' }
]

let successCount = 0
let failCount = 0
let currentIndex = 0

function createAuthUser(rider) {
    return new Promise((resolve) => {
        const email = `${rider.mobile}@rider.shreejientserv.in`
        const data = JSON.stringify({
            email: email,
            password: rider.password,
            email_confirm: true,
            user_metadata: {
                role: 'rider',
                mobile: rider.mobile
            }
        })

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
                if (res.statusCode === 200 || res.statusCode === 201) {
                    successCount++
                    console.log(`✅ ${successCount}/${riders.length} - Created: ${rider.name} (${rider.mobile})`)
                    resolve({ success: true, rider })
                } else {
                    failCount++
                    console.log(`❌ Failed: ${rider.name} - ${responseData.substring(0, 100)}`)
                    resolve({ success: false, rider, error: responseData })
                }
            })
        })

        req.on('error', (e) => {
            failCount++
            console.error(`❌ Error: ${rider.name} - ${e.message}`)
            resolve({ success: false, rider, error: e.message })
        })

        req.write(data)
        req.end()
    })
}

async function createAllUsers() {
    console.log(`\n🚀 Creating auth users for ${riders.length} riders...\n`)

    // Process in batches of 5 to avoid rate limits
    for (let i = 0; i < riders.length; i += 5) {
        const batch = riders.slice(i, i + 5)
        await Promise.all(batch.map(rider => createAuthUser(rider)))

        // Small delay between batches
        if (i + 5 < riders.length) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    console.log(`\n✅ Complete! Success: ${successCount}, Failed: ${failCount}`)
    console.log(`\n🧪 Test login with any rider:`)
    console.log(`   Mobile: 9900028536`)
    console.log(`   Password: 28536`)
}

createAllUsers()
