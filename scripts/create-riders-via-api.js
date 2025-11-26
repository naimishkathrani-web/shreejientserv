const axios = require('axios');

const riders = [
    { pidge_id: 28553, name: 'hemat mukar', mobile: '9811361495', pan: 'LJYPk4790D', aadhar: '250075341330' },
    { pidge_id: 28536, name: 'Mahendra Gupta', mobile: '9920374755', pan: 'DWNPG2076L', aadhar: '455509200479' },
    { pidge_id: 28590, name: 'Rohit niranjan', mobile: '8287305771', pan: 'ENHPR0025J', aadhar: '431227927808' },
    { pidge_id: 30968, name: 'suraj gupta', mobile: '9953459443', pan: 'CERPG7825N', aadhar: '9889 9250 9199' },
    { pidge_id: 31733, name: 'Prdip gupta', mobile: '6386600460', pan: 'DNCPG5675M', aadhar: '926945322275' },
    { pidge_id: 31831, name: 'Arvindkumar Gupta', mobile: '9120060302', pan: 'CVEPG2869N', aadhar: '226314177585' },
    { pidge_id: 31901, name: 'Vijay Kumar', mobile: '9372198752', pan: 'DQMPK7777K', aadhar: '872538232411' },
    { pidge_id: 32584, name: 'Suraj singh', mobile: '8909441604', pan: 'LRNPS0211E', aadhar: '563648779965' },
    { pidge_id: 32754, name: 'Ram Karan', mobile: '9140849574', pan: 'GIYPK3574B', aadhar: '848682589634' },
    { pidge_id: 33285, name: 'nazim umar shah', mobile: '7798198383', pan: 'BZGPS2206E', aadhar: '502982075901' },
    { pidge_id: 33503, name: 'vishnu', mobile: '9552121047', pan: 'BLSPK2587G', aadhar: '997401826941' },
    { pidge_id: 33621, name: 'md shakir ahmed khateeb', mobile: '9916785036', pan: 'KWMPK7292G', aadhar: '528437489775' },
    { pidge_id: 33623, name: 'sachin', mobile: '7666125513', pan: 'NQVPK6774H', aadhar: '935407949862' },
    { pidge_id: 33700, name: 'jay ashish', mobile: '7079417675', pan: 'JFVPK0007L', aadhar: '840840087593' },
    { pidge_id: 34121, name: 'vinod Kumar maurya', mobile: '6394509106', pan: 'FSDPM9960B', aadhar: '860257500053' },
    { pidge_id: 34200, name: 'sahariaj', mobile: '9326428527' },
    { pidge_id: 34265, name: 'Masudahmed Rafik Attar', mobile: '7219626795' },
    { pidge_id: 34305, name: 'Md arman khan', mobile: '9608202946' },
    { pidge_id: 34586, name: 'Salahuddin Khan', mobile: '9919626567', pan: 'CBLPK3500K', aadhar: '393188970664' },
    { pidge_id: 35268, name: 'mohammed jahangir', mobile: '9347469723' },
    { pidge_id: 35418, name: 'pankaj verma', mobile: '9044723963' },
    { pidge_id: 35473, name: 'Swapnil Farade', mobile: '7045421121', pan: 'ACEPF2621C', aadhar: '988108570255' }
];

async function createRiders() {
    try {
        console.log('Creating riders via API...\n');

        const response = await axios.post('http://localhost:3000/api/admin/create-riders', {
            riders
        });

        console.log('Results:');
        response.data.results.forEach(r => {
            if (r.status === 'success') {
                console.log(`✅ ${r.name} (${r.mobile})`);
            } else {
                console.log(`❌ ${r.mobile}: ${r.reason}`);
            }
        });

        console.log('\n✅ Done! Test login with:');
        console.log('Mobile: 9920374755');
        console.log('Password: 9920374755');

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

createRiders();
