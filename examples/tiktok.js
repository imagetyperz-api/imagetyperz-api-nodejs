#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// get access token from: http://www.imagetyperz.com/Forms/ClientHome.aspx
const ACCESS_KEY = 'access_token_here';
imagetyperzapi.set_access_key(ACCESS_KEY);

async function test_api() {
    var captcha_params = {};
    captcha_params.page_url = 'https://tiktok.com';
    // make sure `s_v_web_id` cookie is present
    captcha_params.cookie_input = 's_v_web_id:verify_kd6243o_fd449FX_FDGG_1x8E_8NiQ_fgrg9FEIJ3f;tt_webid:612465623570154;tt_webid_v2:7679206562717014313;SLARDAR_WEB_ID:d0314f-ce16-5e16-a066-71f19df1545f;';
    // captcha_params.proxy = '126.45.34.53:123';     // optional
    // captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

    // get balance
    const balance = await imagetyperzapi.account_balance();
    console.log('Balance:', balance);   // print balance gathered

    // solve captcha
    const captchaID = await imagetyperzapi.submit_tiktok(captcha_params);
    console.log('Waiting for captcha to be solved ...');
    const response = await imagetyperzapi.retrieve_response(captchaID)   // wait for response to get solved
    console.log(`Response: ${JSON.stringify(response)}`)
}

async function main () {
    try {
        await test_api()
    } catch (err) {
        console.log(`Error: ${err.message || err}`)
    }
}

main()
