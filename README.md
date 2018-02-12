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

**Submit image captcha**

``` javascript
imagetyperzapi.solve_captcha('captcha.jpg').then(function (response) {
    console.log('Captcha text:', response);    
})
```
**Works with both image file and URL**
``` javascript
imagetyperzapi.solve_captcha('http://abc.com/your_captcha.jpg').then(function (response) {
    console.log('Captcha text:', response);    
})
```
**Submit recaptcha details**

For recaptcha submission there are two things that are required.
- page_url
- site_key
``` javascript
imagetyperzapi.submit_recaptcha('http://abc.com', '6fbereggr_fdsff3345ff12d').then(function (captchaid) {
    console.log('Captcha ID:', captchaid);   
})
```
This method returns a captchaID. This ID will be used next, to retrieve the g-response, once workers have 
completed the captcha. This takes somewhere between 10-80 seconds.

**Retrieve captcha response**

Once you have the captchaID, you retrieve the response. Normally, you have to re-check every 5 seconds to see if
the captcha is completed or still in progress. The library handles all this for you, all you have to do is call the 
retrieve response method, once.

``` javascript
imagetyperzapi.retrieve_recaptcha('6544564').then(function (response) {
    console.log('Response :', response);   
})
```

##Other methods/variables

**- set_affiliate_id(affiliate_id)**

In case you want to use an *affiliate_id* with the API library, it's really easy to do it.
All you have to do is set the affiliate_id, just like you set the token or username and password
for authentication.
``` javascript
imagetyperzapi.set_affiliate_id('123456789');
```

**- submit_recaptcha(page_url, sitekey, proxy, proxy_type)**

The recaptcha submission method accepts two optional arguments, proxy and proxy_type.
This are used in case you want the recaptcha to be solved using a proxy. The format for **proxy** 
argument is *IP:PORT* (eg. 12.34.56.78:1234 or user:pass@12.34.56.78:1234 [proxy with auth]) and currently 
supported proxy_type is HTTP (only)
``` javascript
imagetyperzapi.submit_recaptcha('http://abc.com', '6fbereggr_fdsff3345ff12d', '12.34.56.78:1234', 'HTTP');
```

**- set_captcha_bad(captcha_id)**

When a captcha was solved wrong by our workers, you can notify the server with it's ID,
so we know something went wrong.
``` javascript
imagetyperzapi.set_captcha_bad('6544564');
```

## Examples
Check the example/example.js

## More information
More details about the server-side API can be found [here](http://imagetyperz.com)