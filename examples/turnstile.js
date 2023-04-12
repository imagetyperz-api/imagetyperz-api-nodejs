#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// get access token from: http://www.imagetyperz.com/Forms/ClientHome.aspx
const ACCESS_KEY = 'access_token_here';
imagetyperzapi.set_access_key(ACCESS_KEY);

async function test_api() {
    var captcha_params = {};
    captcha_params.page_url = 'https://your-site.com';
    captcha_params.sitekey = '0x4ABBBBAABrfvW5vKbx11FZ';
    // captcha_params.domain = 'challenges.cloudflare.com'         // domain used in loading turnstile interface, default: challenges.cloudflare.com - optional
    // captcha_params.action = 'homepage'                          // used in loading turnstile interface, similar to reCAPTCHA - optional
    // captcha_params.cdata = 'your cdata'                         // used in loading turnstile interface - optional
    // captcha_params.proxy = '126.45.34.53:123';     // optional, or 126.45.34.53:123:joe:password
    // captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

    // get balance
    const balance = await imagetyperzapi.account_balance();
    console.log('Balance:', balance);   // print balance gathered

    // solve captcha
    const captchaID = await imagetyperzapi.submit_turnstile(captcha_params);
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
