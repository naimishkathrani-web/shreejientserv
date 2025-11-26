const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dmphpqdjpbqfsdvyqltc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE');

const riders = [
    { id: 28553, name: 'hemat mukar', mobile: '9811361495', pidge_id: 28553, pan: 'LJYPk4790D', aadhar: '250075341330' },
    { id: 28536, name: 'Mahendra Gupta', mobile: '9920374755', pidge_id: 28536, pan: 'DWNPG2076L', aadhar: '455509200479' },
    { id: 28590, name: 'Rohit niranjan', mobile: '8287305771', pidge_id: 28590, pan: 'ENHPR0025J', aadhar: '431227927808' },
    { id: 30968, name: 'suraj gupta', mobile: '9953459443', pidge_id: 30968, pan: 'CERPG7825N', aadhar: '9889 9250 9199' },
    { id: 31733, name: 'Prdip gupta', mobile: '6386600460', pidge_id: 31733, pan: 'DNCPG5675M', aadhar: '926945322275' },
    { id: 31831, name: 'Arvindkumar Gupta', mobile: '9120060302', pidge_id: 31831, pan: 'CVEPG2869N', aadhar: '226314177585' },
    { id: 31901, name: 'Vijay Kumar', mobile: '9372198752', pidge_id: 31901, pan: 'DQMPK7777K', aadhar: '872538232411' },
    { id: 32141, name: 'Vinay Gupta', mobile: '7317858626', pidge_id: 32141, pan: 'DYSP9351P', aadhar: '647693923529' },
    { id: 32398, name: 'Rajkumar puchai rampal', mobile: '9792043946', pidge_id: 32398, pan: 'CMMPP5920', aadhar: '621035696653' },
    { id: 32584, name: 'Suraj singh', mobile: '8909441604', pidge_id: 32584, pan: 'LRNPS0211E', aadhar: '563648779965' },
    { id: 32754, name: 'Ram Karan', mobile: '9140849574', pidge_id: 32754, pan: 'GIYPK3574B', aadhar: '848682589634' },
    { id: 33006, name: 'Samar Pal', mobile: '6392529271', pidge_id: 33006, pan: 'DZWPP2577K', aadhar: '490437757399' },
    { id: 33285, name: 'nazim umar shah', mobile: '7798198383', pidge_id: 33285, pan: 'BZGPS2206E', aadhar: '502982075901' },
    { id: 33503, name: 'vishnu', mobile: '9552121047', pidge_id: 33503, pan: 'BLSPK2587G', aadhar: '997401826941' },
    { id: 33621, name: 'md shakir ahmed khateeb', mobile: '9916785036', pidge_id: 33621, pan: 'KWMPK7292G', aadhar: '528437489775' },
    { id: 33623, name: 'sachin', mobile: '7666125513', pidge_id: 33623, pan: 'NQVPK6774H', aadhar: '935407949862' },
    { id: 33673, name: 'Imran', mobile: '9545424248', pidge_id: 33673, pan: 'DWYPK6141R', aadhar: '462278055328' },
    { id: 33700, name: 'jay ashish', mobile: '7079417675', pidge_id: 33700, pan: 'JFVPK0007L', aadhar: '840840087593' },
    { id: 33797, name: 'vijay kumar saroj', mobile: '7217823805', pidge_id: 33797, pan: '', aadhar: '235044036115' },
    { id: 33833, name: 'Deepanshu', mobile: '7982239225', pidge_id: 33833, pan: 'KQOPD8636K', aadhar: '5456' },
    { id: 34121, name: 'vinod Kumar maurya', mobile: '6394509106', pidge_id: 34121, pan: 'FSDPM9960B', aadhar: '860257500053' },
    { id: 34200, name: 'sahariaj', mobile: '9326428527', pidge_id: 34200, pan: '', aadhar: '' },
    { id: 34265, name: 'Masudahmed Rafik Attar', mobile: '7219626795', pidge_id: 34265, pan: '', aadhar: '' },
    { id: 34305, name: 'Md arman khan', mobile: '9608202946', pidge_id: 34305, pan: '', aadhar: '' },
    { id: 34499, name: '', mobile: '', pidge_id: 34499, pan: '', aadhar: '' },
    { id: 34586, name: 'Salahuddin Khan', mobile: '9919626567', pidge_id: 34586, pan: 'CBLPK3500K', aadhar: '393188970664' },
    { id: 34591, name: 'Ganesh Rajput', mobile: '8421288309', pidge_id: 34591, pan: '', aadhar: '' },
    { id: 34976, name: 'Sandeep Yadav', mobile: '6386677492', pidge_id: 34976, pan: '', aadhar: '' },
    { id: 35024, name: 'Dharmveer Singh', mobile: '9027374974', pidge_id: 35024, pan: '', aadhar: '' },
    { id: 35121, name: '', mobile: '', pidge_id: 35121, pan: '', aadhar: '' },
    { id: 35268, name: 'mohammed jahangir', mobile: '9347469723', pidge_id: 35268, pan: '', aadhar: '' },
    { id: 35360, name: '', mobile: '', pidge_id: 35360, pan: '', aadhar: '' },
    { id: 35393, name: 'suraj gupta', mobile: '8779286549', pidge_id: 35393, pan: '', aadhar: '' },
    { id: 35418, name: 'pankaj verma', mobile: '9044723963', pidge_id: 35418, pan: '', aadhar: '' },
    { id: 35473, name: 'Swapnil Farade', mobile: '7045421121', pidge_id: 35473, pan: 'ACEPF2621C', aadhar: '988108570255' },
    { id: 35499, name: '', mobile: '', pidge_id: 35499, pan: '', aadhar: '' },
    { id: 35646, name: '', mobile: '', pidge_id: 35646, pan: '', aadhar: '' },
    { id: 35672, name: 'pradeep singh', mobile: '8779060678', pidge_id: 35672, pan: '', aadhar: '' },
    { id: 35674, name: '', mobile: '', pidge_id: 35674, pan: '', aadhar: '' },
    { id: 35690, name: 'Amit Talekar', mobile: '9137430480', pidge_id: 35690, pan: '', aadhar: '' },
    { id: 35764, name: 'Tushar Deshmukh', mobile: '8080939499', pidge_id: 35764, pan: '', aadhar: '' },
    { id: 35835, name: '', mobile: '', pidge_id: 35835, pan: '', aadhar: '' },
    { id: 35840, name: 'Surendra Gupta', mobile: '9702223664', pidge_id: 35840, pan: 'BOQPG7733F', aadhar: '341602629677' },
    { id: 35897, name: '', mobile: '', pidge_id: 35897, pan: '', aadhar: '' },
    { id: 36106, name: 'Surendra Gupta', mobile: '8898880536', pidge_id: 36106, pan: '', aadhar: '' },
    { id: 36176, name: 'Harikesh yadav', mobile: '9321362429', pidge_id: 36176, pan: 'APYPY0271Q', aadhar: '298320416447' },
    { id: 36186, name: '', mobile: '', pidge_id: 36186, pan: '', aadhar: '' },
    { id: 36260, name: '', mobile: '', pidge_id: 36260, pan: '', aadhar: '' },
    { id: 36323, name: 'Dilip Patel', mobile: '8397821838', pidge_id: 36323, pan: '', aadhar: '380037884588' },
    { id: 36401, name: '', mobile: '', pidge_id: 36401, pan: '', aadhar: '' }
];

async function createRiders() {
    console.log('Creating riders with complete details...\n');

    for (const r of riders) {
        if (!r.mobile) {
            console.log(`⚠️ Skipping rider ${r.id} - no mobile number`);
            continue;
        }

        try {
            // Create auth user
            const email = `${r.mobile}@rider.shreejientserv.in`;
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email,
                password: r.mobile,
                email_confirm: true,
                user_metadata: { role: 'rider' }
            });

            if (authError) {
                console.log(`❌ Auth failed for ${r.mobile}: ${authError.message}`);
                continue;
            }

            // Create rider record
            const nameParts = (r.name || `Rider ${r.id}`).split(' ');
            const { data: rider, error: riderError } = await supabase.from('riders').insert({
                user_id: authUser.user.id,
                first_name: nameParts[0] || 'Rider',
                last_name: nameParts.slice(1).join(' ') || r.id.toString(),
                mobile: r.mobile,
                pidge_rider_id: r.pidge_id,
                pan_number: r.pan || null,
                aadhar_number: r.aadhar || null,
                status: 'active',
                wallet_balance: 0
            }).select().single();

            if (riderError) {
                console.log(`❌ Rider insert failed for ${r.mobile}: ${riderError.message}`);
                continue;
            }

            console.log(`✅ Created: ${r.name || r.id} (${r.mobile})`);
        } catch (error) {
            console.log(`❌ Error for ${r.mobile}: ${error.message}`);
        }
    }

    console.log('\n✅ Rider creation complete!');
    console.log('\n📱 Test Login Credentials:');
    console.log('Email: {mobile}@rider.shreejientserv.in');
    console.log('Password: {mobile}');
    console.log('\nExample: 9811361495@rider.shreejientserv.in / 9811361495');
}

createRiders();
