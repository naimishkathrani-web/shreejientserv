const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dmphpqdjpbqfsdvyqltc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE');

async function createTestRider() {
    const mobile = '9920374755';
    const email = `${mobile}@rider.shreejientserv.in`;

    try {
        console.log(`Creating test rider: ${mobile}`);

        // Create auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: mobile,
            email_confirm: true,
            user_metadata: { role: 'rider' }
        });

        if (authError) {
            console.log('Auth error:', authError.message);
            return;
        }

        console.log('✅ Auth user created:', authUser.user.id);

        // Create rider record
        const { data: rider, error: riderError } = await supabase.from('riders').insert({
            user_id: authUser.user.id,
            first_name: 'Mahendra',
            last_name: 'Gupta',
            mobile: mobile,
            pidge_rider_id: 28536,
            pan_number: 'DWNPG2076L',
            aadhar_number: '455509200479',
            status: 'active',
            wallet_balance: 0
        }).select().single();

        if (riderError) {
            console.log('Rider error:', riderError.message);
            return;
        }

        console.log('✅ Rider created:', rider.id);
        console.log('\n📱 Login Credentials:');
        console.log(`Mobile: ${mobile}`);
        console.log(`Password: ${mobile}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

createTestRider();
