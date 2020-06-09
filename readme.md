imagetyperz-api - Imagetyperz nodejs API wrapper
================================================

ImagetyperzAPI is a super easy to use bypass captcha API wrapper for imagetyperz.com captcha service

## Installation

	npm install imagetyperz-api
or

	git clone https://github.com/imagetyperz-api/imagetyperz-api-nodejs

## How to use?

ImagetyperzAPI uses promise handling

Simply require the module, set the auth details and start using the captcha service:

``` javascript
var imagetyperzapi = require('imagetyperz-api'); 
```
Set access_token or username and password (legacy) for authentication

``` javascript
// access key - preferred
imagetyperzapi.set_access_key('YOUR_ACCESS_KEY');
// username and password (legacy)
imagetyperzapi.set_user_password('YOUR_USERNAME', 'YOUR_PASSWORD')
```
Once you've set your authentication details, you can start using the API

**Get balance**

``` javascript
imagetyperzapi.account_balance().then(function (balance) {
    console.log('Balance:', balance);
})
```

## Image captcha

### Submit image captcha

``` javascript
var image_params = {};
// below params are optional
image_params.iscase = 'true';         // case sensitive captcha
image_params.isphrase = 'true';       // text contains at least one space (phrase)
image_params.ismath = 'true';         // instructs worker that a math captcha has to be solved
image_params.alphanumeric = '2';      // 1 - digits only, 2 - letters only
image_params.minlength = 2;           // captcha text length (minimum)
image_params.maxlength = 6;           // captcha text length (maximum)

imagetyperzapi.solve_captcha('captcha.jpg', image_params).then(function (data) {
    console.log('Captcha ID:', data.id);
    console.log('Captcha text:', data.text);
})
```
**Works with both image file and URL**
``` javascript
imagetyperzapi.solve_captcha('http://abc.com/your_captcha.jpg', image_params).then(function (data) {
    console.log('Captcha ID:', data.id);
    console.log('Captcha text:', data.text);
})
```

## reCAPTCHA

### Submit reCAPTCHA details

For recaptcha submission there are two things that are required.
- page_url
- site_key
- type - can be one of this 3 values: `1` - normal, `2` - invisible, `3` - v3 (it's optional, defaults to `1`)
- v3_min_score - minimum score to target for v3 recaptcha `- optional`
- v3_action - action parameter to use for v3 recaptcha `- optional`
- proxy - proxy to use when solving recaptcha, eg. `12.34.56.78:1234` or `12.34.56.78:1234:user:password` `- optional`
- user_agent - useragent to use when solve recaptcha `- optional` 

``` javascript
var recaptcha_params = {};
recaptcha_params.page_url = 'example.com';
recaptcha_params.sitekey = 'sitekey_here';
recaptcha_params.type = 3;                       // optional, defaults to 1
recaptcha_params.v3_min_score = 0.3;             // min score to target when solving v3 - optional
recaptcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
recaptcha_params.proxy = '126.45.34.53:123';     // HTTP proxy - optional
recaptcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
recaptcha_params.data_s = 'recaptcha data-s value' // optional
return imagetyperzapi.submit_recaptcha(recaptcha_params);       // returns a promise
```
This method returns a captchaID (promise). This ID will be used next, to retrieve the g-response, once workers have 
completed the captcha. This takes somewhere between 10-80 seconds.

### Retrieve reCAPTCHA response

Once you have the captchaID, you retrieve the response. Normally, you have to re-check every 5 seconds to see if
the captcha is completed or still in progress. The library handles all this for you, all you have to do is call the 
retrieve response method, once.

``` javascript
imagetyperzapi.retrieve_recaptcha('6544564').then(function (response) {
    console.log('Response :', response);   
})
```

## GeeTest


GeeTest is a captcha that requires 3 parameters to be solved:
- domain
- challenge
- gt

The response of this captcha after completion are 3 codes:
- challenge
- validate
- seccode

### Submit GeeTest
```javascript
geetest_params = {
        'domain' :'domain_here',
        'challenge': 'challenge_here',
        'gt': 'gt_here',
        'proxy': '126.45.34.53:345',    # or 126.45.34.53:123:joe:password, optional
        'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0'    # optional
};
return imagetyperzapi.submit_geetest(geetest_params);
```

Just like reCAPTCHA, you'll receive a captchaID.
Using the ID, you'll be able to retrieve 3 codes after completion.

Optionally, you can send proxy and user_agent along.

### Retrieve GeeTest codes
```javascript
imagetyperzapi.retrieve_geetest(geetest_id)
.then(function (geetest_response){
   console.log('Geetest response', geetest_response);
})
```

Response will be an (JSON) object that looks like this: `{'challenge': '...', 'validate': '...', 'seccode': '...'}`

## Capy & hCaptcha

This are two different captcha types, but both are similar to reCAPTCHA. They require a `pageurl` and `sitekey` for solving. hCaptcha is the newest one.

### IMPORTANT
For this two captcha types, the reCAPTCHA methods are used (explained above), except that there's one small difference.

The `pageurl` parameter should have at the end of it `--capy` added for Capy captcha and `--hcaptcha` for the hCaptcha. This instructs our system it's a capy or hCaptcha. It will be changed in the future, to have it's own endpoints.

For example, if you were to have the `pageurl` = `https://mysite.com` you would send it as `https://mysite.com--capy` if it's capy or `https://mysite.com--hcaptcha` for hCaptcha. Both require a sitekey too, which is sent as reCAPTCHA sitekey, and response is received as reCAPTCHA response, once again using the reCAPTCHA method.

#### Example
``` javascript
var p = {};
p.page_url = 'example.com--capy';		// add --capy or --hcaptcha at the end, to submit capy or hCaptcha
p.sitekey = 'sitekey_here';

// submit it as recaptcha
imagetyperzapi.submit_recaptcha(p).then(function (id){
	return imagetyperzapi.retrieve_recaptcha(id);
}).then(function (solution){
	console.log(`Capy response: ${solution}`);
});
```

## Other methods

**- set_affiliate_id(affiliate_id)**

In case you want to use an *affiliate_id* with the API library, it's really easy to do it.
All you have to do is set the affiliate_id, just like you set the token or username and password
for authentication.
``` javascript
imagetyperzapi.set_affiliate_id('123456789');
```

**- was_proxy_used(recaptcha_id)**

In case you submitted the recaptcha with proxy, you can check the status of the proxy, if it was used or not,
and if not, what the reason was with the following:

``` javascript
imagetyperzapi.was_proxy_used(recaptcha_id)
```


**- set_captcha_bad(captcha_id)**

When a captcha was solved wrong by our workers, you can notify the server with it's ID,
so we know something went wrong.
``` javascript
imagetyperzapi.set_captcha_bad('6544564');
```

## Examples
Check the example/example.js

## License
API library is licensed under the MIT License

## More information
More details about the server-side API can be found [here](http://imagetyperz.com)


<sup><sub>captcha, bypasscaptcha, decaptcher, decaptcha, 2captcha, deathbycaptcha, anticaptcha, 
bypassrecaptchav2, bypassnocaptcharecaptcha, bypassinvisiblerecaptcha, captchaservicesforrecaptchav2, 
recaptchav2captchasolver, googlerecaptchasolver, recaptchasolverpython, recaptchabypassscript</sup></sub>

