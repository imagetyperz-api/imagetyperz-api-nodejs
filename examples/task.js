#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// get access token from: http://www.imagetyperz.com/Forms/ClientHome.aspx
const ACCESS_KEY = 'access_token_here';
imagetyperzapi.set_access_key(ACCESS_KEY);

async function test_api() {
    var captcha_params = {};
    captcha_params = {
        'template_name': 'Login test page',
        'page_url': 'https://imagetyperz.net/automation/login',
        'variables': {"username": 'abc', "password": 'paZZW0rd'},
        // 'proxy': '126.45.34.53:345',   # or 126.45.34.53:123:joe:password
        // 'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0',    # optional
    }
    // captcha_params.proxy = '126.45.34.53:123';     // optional
    // captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

    // get balance
    const balance = await imagetyperzapi.account_balance();
    console.log('Balance:', balance);   // print balance gathered

    // solve captcha
    const captchaID = await imagetyperzapi.submit_task(captcha_params);
    console.log('Waiting for captcha to be solved ...');

    // # send pushVariable - update of variable while task is running (e.g 2FA code)
    // await imagetyperzapi.task_push_variables(captchaID, {"twofactor_code": "32484"})

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
