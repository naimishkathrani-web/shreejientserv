const axios = require('axios');
const FormData = require('form-data');

async function testAPI(actionId, name) {
    const form = new FormData();
    form.append('executeActionDTO', JSON.stringify({
        actionId: actionId,
        viewMode: true,
        paramProperties: {
            k0: { datatype: 'string', blobIdentifiers: [] },
            k1: { datatype: 'string', blobIdentifiers: [] },
            k2: { datatype: 'string', blobIdentifiers: [] }
        },
        analyticsProperties: { isUserInitiated: false }
    }));

    form.append('parameterMap', JSON.stringify({
        'appsmith.store.selected_business': 'k0',
        'moment(end_date.selectedDate).endOf("day").format("YYYY-MM-DD")': 'k1',
        'moment(start_date.selectedDate).startOf("day").format("YYYY-MM-DD")': 'k2'
    }));

    form.append('k0', 'Shreeji Enterprise Services', { filename: 'blob', contentType: 'text/plain' });
    form.append('k1', '2025-11-23', { filename: 'blob', contentType: 'text/plain' });
    form.append('k2', '2025-11-23', { filename: 'blob', contentType: 'text/plain' });

    const headers = {
        ...form.getHeaders(),
        'accept': 'application/json',
        'cookie': 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831',
        'x-appsmith-environmentid': '670f48b619b75a1d0a004d84',
        'x-xsrf-token': 'bbf2bc5a-b39f-47c6-bb74-3cf677129831'
    };

    try {
        const response = await axios.post('https://app.appsmith.com/api/v1/actions/execute', form, { headers });
        const data = response.data.data.body;
        console.log(`\n✅ ${name} (${actionId}):`);
        console.log(`Records: ${data.length}`);
        if (data.length > 0) {
            console.log('Sample:', JSON.stringify(data[0], null, 2));
        }
    } catch (error) {
        console.error(`❌ ${name} failed:`, error.message);
    }
}

async function testAll() {
    await testAPI('68ef4d691cdba9790964c746', 'API 1');
    await testAPI('6914db40a480302e85565079', 'API 2');
    await testAPI('6914d948fcae904e232d1ede', 'API 3');
    await testAPI('6914d8f2a480302e8556471a', 'API 4 (trips)');
}

testAll();
