#!/usr/bin/node

// require library
var imagetyperzapi = require('../');

// check dashboard for accesskey
const ACCESS_KEY = 'YOUR_ACCESS_KEY';

// recaptcha details
// ------------------
const PAGE_URL = 'YOUR_PAGE_URL';
const SITEKEY = 'YOUR_SITEKEY';

// authenticate with accesskey
// ----------------------------
//imagetyperzapi.set_access_key(ACCESS_KEY);

// authenticate with username and password - legacy
// accesskey auth is preferred
// imagetyperzapi.set_user_password('YOUR_USERNAME', 'YOUR_PASSWORD');
// first, get account balance
// --------------------------
imagetyperzapi.account_balance().then(function (balance) {
    console.log('Balance:', balance);   // print balance gathered
    // solve image captcha
    // ------------------------------------------------
    console.log('Waiting for captcha to be solved ...');
    // solve_captcha(url, case_sensitive = 1 [optional])
    return imagetyperzapi.solve_captcha('captcha.jpg');
}).then(function (data) {
    console.log('Captcha text:', data);    // print captcha text and submit recaptcha
    // submit recaptcha details
    // --------------------------------------
    return imagetyperzapi.submit_recaptcha(PAGE_URL, SITEKEY);
}).then(function (id){
    // we have the recaptcha ID here
    // ------------------------------
    console.log('Waiting for recaptcha #' + id + ' to be solved ...');
    // get the g-response using the ID
    // -------------------------------
    return imagetyperzapi.retrieve_recaptcha(id);
}).then(function(gresponse){
    // at this point, we have the g-response
    // --------------------------------------
    console.log('Recaptcha response:', gresponse);
}).catch(function (err) {
    var e = err.message || err;
    console.log(e);
}).then(function(){
    log('Example finished !');
});

