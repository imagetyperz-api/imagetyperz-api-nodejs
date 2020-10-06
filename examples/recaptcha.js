#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// get access token from: http://www.imagetyperz.com/Forms/ClientHome.aspx
const ACCESS_KEY = 'access_token_here';
imagetyperzapi.set_access_key(ACCESS_KEY);

async function test_api() {
    var captcha_params = {};
    captcha_params.page_url = 'https://your-site.com';
    captcha_params.sitekey = '7LrGJmcUABBAALFtIb_FxC0LXm_GwOLyJAfbbUCL';
    // captcha_params.type = 3;                       // optional, defaults to 1
    // captcha_params.v3_min_score = 0.3;             // min score to target when solving v3 - optional
    // captcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
    // captcha_params.proxy = '126.45.34.53:123';     // optional
    // captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
    // captcha_params.data_s = 'recaptcha data-s value' // optional

    // get balance
    const balance = await imagetyperzapi.account_balance();
    console.log('Balance:', balance);   // print balance gathered

    // solve captcha
    const captchaID = await imagetyperzapi.submit_recaptcha(captcha_params);
    console.log('Waiting for captcha to be solved ...');
    const response = await imagetyperzapi.retrieve_response(captchaID)   // wait for response to get solved
    console.log(`Response: ${JSON.stringify(response)}`)

    // other examples
    // imagetyperzapi.set_affiliate_id(123)     // for usage with affiliateID
    // imagetyperzapi.set_captcha_bad(captchaID)   // set captcha as bad
}

async function main () {
    try {
        await test_api()
    } catch (err) {
        console.log(`Error: ${err.message || err}`)
    }
}

main()
