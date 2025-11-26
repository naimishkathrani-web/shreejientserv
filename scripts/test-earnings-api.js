const axios = require('axios');
const FormData = require('form-data');

const PIDGE_CONFIG = {
    url: 'https://app.appsmith.com/api/v1/actions/execute',
    actionId: '68ef4d691cdba9790964c73f',
    cookies: 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    xsrfToken: 'bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    environmentId: '670f48b619b75a1d0a004d84'
};

async function testEarningsAPI() {
    const form = new FormData();

    form.append('executeActionDTO', JSON.stringify({
        actionId: PIDGE_CONFIG.actionId,
        viewMode: true,
        paramProperties: {
            k0: { datatype: 'string', blobIdentifiers: [] },
            k1: { datatype: 'string', blobIdentifiers: [] },
            k2: { datatype: 'string', blobIdentifiers: [] }
        },
        analyticsProperties: { isUserInitiated: false }
    }));

    form.append('parameterMap', JSON.stringify({
        "moment(start_date.selectedDate).startOf('day').format()": "k0",
        " appsmith.store.selected_business ": "k1",
        "moment(end_date.selectedDate).startOf('day').format()": "k2"
    }));

    form.append('k0', '2025-11-23T00:00:00+05:30', { filename: 'blob', contentType: 'text/plain' });
    form.append('k1', 'Shreeji Enterprise Services', { filename: 'blob', contentType: 'text/plain' });
    form.append('k2', '2025-11-23T00:00:00+05:30', { filename: 'blob', contentType: 'text/plain' });

    const headers = {
        ...form.getHeaders(),
        'accept': 'application/json',
        'cookie': PIDGE_CONFIG.cookies,
        'x-appsmith-environmentid': PIDGE_CONFIG.environmentId,
        'x-xsrf-token': PIDGE_CONFIG.xsrfToken
    };

    try {
        const response = await axios.post(PIDGE_CONFIG.url, form, { headers });
        console.log('✅ API 1 Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ API 1 Failed:', error.response ? error.response.data : error.message);
    }
}

testEarningsAPI();
