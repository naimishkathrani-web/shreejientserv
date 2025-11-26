const axios = require('axios');
const FormData = require('form-data');

async function testPidgeApi() {
    const url = 'https://app.appsmith.com/api/v1/actions/execute';

    const form = new FormData();
    form.append('executeActionDTO', JSON.stringify({
        "actionId": "68ef4d691cdba9790964c742",
        "viewMode": true,
        "paramProperties": {
            "k0": {
                "datatype": "string",
                "blobIdentifiers": []
            }
        },
        "analyticsProperties": {
            "isUserInitiated": false
        }
    }));
    form.append('parameterMap', JSON.stringify({
        "appsmith.store.selected_business": "k0"
    }));
    form.append('k0', 'Shreeji Enterprise Services', {
        filename: 'blob',
        contentType: 'text/plain'
    });

    const headers = {
        ...form.getHeaders(),
        'accept': 'application/json',
        'cookie': 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831; ajs_anonymous_id=3a6e9d32-10a7-47b1-bb50-3a84fbd8116a; _gcl_au=1.1.2137053823.1764033677; _clck=11gbiz1%5E2%5Eg1b%5E0%5E2155; _clsk=vag20r%5E1764034583396%5E2%5E1%5Ea.clarity.ms%2Fcollect',
        'origin': 'https://app.appsmith.com',
        'referer': 'https://app.appsmith.com/app/ppn-floating-fleet-ch/home-68ef4d691cdba9790964c733',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        'x-appsmith-environmentid': '670f48b619b75a1d0a004d84',
        'x-xsrf-token': 'bbf2bc5a-b39f-47c6-bb74-3cf677129831'
    };

    try {
        const response = await axios.post(url, form, { headers });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testPidgeApi();
