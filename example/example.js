#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// check dashboard for accesskey
const ACCESS_KEY = 'access_token_here';

// image, optional parameters
var image_params = {};
// image_params.iscase = 'true';         // case sensitive captcha
// image_params.isphrase = 'true';       // text contains at least one space (phrase)
// image_params.ismath = 'true';         // instructs worker that a math captcha has to be solved
// image_params.alphanumeric = '2';      // 1 - digits only, 2 - letters only
// image_params.minlength = 2;           // captcha text length (minimum)
// image_params.maxlength = 6;           // captcha text length (maximum)

// recaptcha parameters
var recaptcha_params = {};
// recaptcha_params.page_url = 'example.com';       // add --capy or --hcaptcha at the end, to submit capy or hCaptcha
// recaptcha_params.sitekey = 'sitekey_here';
// recaptcha_params.type = 3;                       // optional, defaults to 1
// recaptcha_params.v3_min_score = 0.3;             // min score to target when solving v3 - optional
// recaptcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
// recaptcha_params.proxy = '126.45.34.53:123';     // optional
// recaptcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
// recaptcha_params.data_s = 'recaptcha data-s value' // optional

// geetest parameters
var geetest_params = {};
geetest_params.domain = 'example.com';
geetest_params.challenge = 'example.com';
geetest_params.gt = 'sitekey_here';
//geetest_params.proxy = '126.45.34.53:123';     // optional
//geetest_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

// authenticate with accesskey
// ----------------------------
imagetyperzapi.set_access_key(ACCESS_KEY);
var recaptcha_id = undefined;

// authenticate with username and password - legacy
// accesskey auth is preferred
//imagetyperzapi.set_user_password('your_username', 'your_password');
// first, get account balance
// --------------------------
imagetyperzapi.account_balance().then(function (balance) {
    console.log('Balance:', balance);   // print balance gathered
    //solve image captcha
    //------------------------------------------------
    console.log('Waiting for captcha to be solved ...');
    return imagetyperzapi.solve_captcha('captcha.jpg', image_params);
}).then(function (data) {
    console.log('Captcha ID: ' + data.id);
    console.log('Captcha text:', data.text);    // print captcha text and submit recaptcha
    // submit recaptcha details
    // --------------------------------------
    return imagetyperzapi.submit_recaptcha(recaptcha_params);
}).then(function(id){
    recaptcha_id = id;      // save to use with was_proxy_used(id) method
    console.log('Waiting for recaptcha #' + recaptcha_id + ' to be solved ...');
    return imagetyperzapi.retrieve_recaptcha(recaptcha_id);     // get the g-response using the ID
}).then(function(gresponse) {
    // we have the gresponse at this point
    // -------------------------------------------
    console.log('Recaptcha response:', gresponse);
})
    // submit geetest captcha
    // ----------------------
    /*return imagetyperzapi.submit_geetest(geetest_params);
}).then(function (geetest_id){
    console.log('Waiting for geetest #' + geetest_id + ' to be solved ...');
    return imagetyperzapi.retrieve_geetest(geetest_id);
}).then(function (geetest_response){
    console.log('Geetest response', geetest_response);
}).then(function(){
    return imagetyperzapi.was_proxy_used(recaptcha_id); // check if proxy was used
}).then(function(was_used){
    console.log(was_used);
})*/.catch(function (err) {
    console.log(err.message || err);
}).then(function(){
    log('Example finished !');
});
