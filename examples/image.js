#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// get access token from: http://www.imagetyperz.com/Forms/ClientHome.aspx
const ACCESS_KEY = 'access_token_here';
imagetyperzapi.set_access_key(ACCESS_KEY);

async function test_api() {
    // image, optional parameters
    var captcha_params = {};
    // captcha_params.iscase = 'true';         // case sensitive captcha
    // captcha_params.isphrase = 'true';       // text contains at least one space (phrase)
    // captcha_params.ismath = 'true';         // instructs worker that a math captcha has to be solved
    // captcha_params.alphanumeric = '2';      // 1 - digits only, 2 - letters only
    // captcha_params.minlength = 2;           // captcha text length (minimum)
    // captcha_params.maxlength = 6;           // captcha text length (maximum)

    // get balance
    const balance = await imagetyperzapi.account_balance();
    console.log('Balance:', balance);   // print balance gathered

    // solve captcha
    console.log('Waiting for captcha to be solved ...');
    const captcha_id = await imagetyperzapi.submit_image('captcha.jpg', captcha_params);
    const response = await imagetyperzapi.retrieve_response(captcha_id);
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
