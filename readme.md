imagetyperz-api-nodejs - Imagetyperz API wrapper
=========================================

imagetyperzapi is a super easy to use bypass captcha API wrapper for imagetyperz.com captcha service

## Installation
	npm install imagetyperz-api

or

    git clone https://github.com/imagetyperz-api/imagetyperz-api-nodejs

## Usage

Simply require the module, set the auth details and start using the captcha service:

```javascript
var imagetyperzapi = require('imagetyperz-api')
```
Set access_token for authentication:

```javascript
// get access token from: http://www.imagetyperz.com/Forms/ClientHome.aspx
const ACCESS_KEY = 'access_token_here'
imagetyperzapi.set_access_key(ACCESS_KEY)
```
Once you've set your authentication details, you can start using the API.

**Get balance**

```javascript
const balance = await imagetyperzapi.account_balance()
console.log('Balance:', balance)
```

## Solving
For solving a captcha, it's a two step process:
- **submit captcha** details - returns an ID
- use ID to check it's progress - and **get solution** when solved.

Each captcha type has it's own submission method.

For getting the response, same method is used for all types.


### Image captcha

```javascript
var captcha_params = {}
// captcha_params.iscase = 'true';         // case sensitive captcha
// captcha_params.isphrase = 'true';       // text contains at least one space (phrase)
// captcha_params.ismath = 'true';         // instructs worker that a math captcha has to be solved
// captcha_params.alphanumeric = '2';      // 1 - digits only, 2 - letters only
// captcha_params.minlength = 2;           // captcha text length (minimum)
// captcha_params.maxlength = 6;           // captcha text length (maximum)
const captcha_id = await imagetyperzapi.submit_image('captcha.jpg', captcha_params)
```
ID is used to retrieve solution when solved.

**Observation**
It works with URL instead of image file too, but authentication has to be done using token.

### reCAPTCHA

For recaptcha submission there are two things that are required.
- page_url (**required**)
- site_key (**required**)
- type (optional, defaults to 1 if not given)
    - `1` - v2
    - `2` - invisible
    - `3` - v3
    - `4` - enterprise v2
    - `5` - enterprise v3
- v3_min_score - minimum score to target for v3 recaptcha `- optional`
- v3_action - action parameter to use for v3 recaptcha `- optional`
- proxy - proxy to use when solving recaptcha, eg. `12.34.56.78:1234` or `12.34.56.78:1234:user:password` `- optional`
- user_agent - useragent to use when solve recaptcha `- optional` 
- data-s - extra parameter used in solving recaptcha `- optional`
- cookie_input - cookies used in solving reCAPTCHA - `- optional`

```javascript
var captcha_params = {}
captcha_params.page_url = 'https://your-site.com'
captcha_params.sitekey = '7LrGJmcUABBAALFtIb_FxC0LXm_GwOLyJAfbbUCL'
// captcha_params.type = 3;                       // optional, defaults to 1
// captcha_params.v3_min_score = 0.3;             // min score to target when solving v3 - optional
// captcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
// captcha_params.data_s = 'recaptcha data-s value' // optional
// captcha_params.cookie_input = 'a=b;c=d'        // optional
const captchaID = await imagetyperzapi.submit_recaptcha(captcha_params)
```
ID will be used to retrieve the g-response, once workers have 
completed the captcha. This takes somewhere between 10-80 seconds. 

Check **Retrieve response** 

### GeeTest

GeeTest is a captcha that requires 3 parameters to be solved:
- domain
- challenge
- gt
- api_server (optional)

The response of this captcha after completion are 3 codes:
- challenge
- validate
- seccode

**Important**
This captcha requires a **unique** challenge to be sent along with each captcha.

```javascript
var captcha_params = {}
captcha_params.domain = 'https://your-site.com'
captcha_params.challenge = 'eea8d7d1bd1a933d72a9eda8af6d15d3'
captcha_params.gt = '1a761081b1114c388092c8e2fd7f58bc'
// captcha_params.api_server = 'api.geetest.com'     // geetest domain - optional
// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
const captchaID = await imagetyperzapi.submit_geetest(captcha_params)
```

Optionally, you can send proxy and user_agent along.

### GeeTestV4

GeeTesV4 is a new version of captcha from geetest that requires 2 parameters to be solved:

- domain
- geetestid (captchaID) - gather this from HTML source of page with captcha, inside the `<script>` tag you'll find a link that looks like this: https://i.imgur.com/XcZd47y.png

The response of this captcha after completion are 5 parameters:

- captcha_id
- lot_number
- pass_token
- gen_time
- captcha_output

```javascript
var captcha_params = {};
captcha_params.domain = 'https://example.com';
captcha_params.geetestid = '647f5ed2ed8acb4be36784e01556bb71';
// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
const captchaID = await imagetyperzapi.submit_geetest_v4(captcha_params);
```

Optionally, you can send proxy and user_agent along.

### hCaptcha

Requires page_url and sitekey

```javascript
var captcha_params = {}
captcha_params.page_url = 'https://your-site.com'
captcha_params.sitekey = '8c7062c7-cae6-4e12-96fb-303fbec7fe4f'
// captcha_params.invisible = '1';     // if captcha is invisible - optional

// extra parameters, useful for enterprise
// submit userAgent from requests too, when this is used
// captcha_params.HcaptchaEnterprise = {
//      'rq_data': 'take value from web requests'
// }

// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
const captchaID = await imagetyperzapi.submit_hcaptcha(captcha_params)
```

### Capy

Requires page_url and sitekey

```javascript
var captcha_params = {}
captcha_params.page_url = 'https://your-site.com'
captcha_params.sitekey = 'Fme6hZLjuCRMMC3uh15F52D3uNms5c'
// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
const captchaID = await imagetyperzapi.submit_capy(captcha_params)
```

### Tiktok

Requires page_url and cookie_input

```javascript
var captcha_params = {}
captcha_params.page_url = 'https://tiktok.com'
// make sure `s_v_web_id` cookie is present
captcha_params.cookie_input = 's_v_web_id:verify_kd6243o_fd449FX_FDGG_1x8E_8NiQ_fgrg9FEIJ3f;tt_webid:612465623570154;tt_webid_v2:7679206562717014313;SLARDAR_WEB_ID:d0314f-ce16-5e16-a066-71f19df1545f;';
// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
const captchaID = await imagetyperzapi.submit_tiktok(captcha_params)
```

### FunCaptcha

Requires page_url, sitekey and s_url (source URL)

```javascript
var captcha_params = {};
captcha_params.page_url = 'https://your-site.com';
captcha_params.sitekey = '11111111-1111-1111-1111-111111111111';
captcha_params.s_url = 'https://api.arkoselabs.com';
// captcha_params.data = '{"a": "b"}';            // optional, extra funcaptcha data in JSON format
// captcha_params.proxy = '126.45.34.53:123';     // optional, or 126.45.34.53:123:joe:password
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
const captchaID = await imagetyperzapi.submit_funcaptcha(captcha_params)
```

### Task

Requires template_name, page_url and usually variables

```javascript
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
const captchaID = await imagetyperzapi.submit_task(captcha_params)
```

#### Task pushVariable
Update a variable value while task is running. Useful when dealing with 2FA authentication.

When template reaches an action that uses a variable which wasn't provided with the submission of the task,
task (while running on worker machine) will wait for variable to be updated through push.

You can use the pushVariables method as many times as you need, even overwriting previously set variables.
```javascript
await imagetyperzapi.task_push_variables(captchaID, {"twofactor_code": "32484"})
```

## Retrieve response

Regardless of the captcha type (and method) used in submission of the captcha, this method is used
right after to check for it's solving status and also get the response once solved.

It requires one parameter, that's the **captcha ID** gathered from first step.

```javascript
const response = await imagetyperzapi.retrieve_response(captchaID)   // wait for response to get solved
```

```javascript
const captchaID = await imagetyperzapi.submit_recaptcha(captcha_params)
console.log('Waiting for captcha to be solved ...')
const response = await imagetyperzapi.retrieve_response(captchaID)   // wait for response to get solved
console.log(`Response: ${JSON.stringify(response)}`)
```
The response is a JSON object that looks like this:
```json
{
  "CaptchaId": 176707908, 
  "Response": "03AGdBq24PBCbwiDRaS_MJ7Z...mYXMPiDwWUyEOsYpo97CZ3tVmWzrB", 
  "Cookie_OutPut": "", 
  "Proxy_reason": "", 
  "Recaptcha score": 0.0, 
  "Status": "Solved"
}
```

## Other methods/variables

**Affiliate id**

Set affiliate ID, using `set_affiliate_id` method
```javascript
imagetyperzapi.set_affiliate_id(123)
```

**Set captcha bad**

When a captcha was solved wrong by our workers, you can notify the server with it's ID,
so we know something went wrong.

```javascript
imagetyperzapi.set_captcha_bad(captchaID)
```

## Examples
Check `examples` folder. 

It contains an example for each type of captcha.

## License
API library is licensed under the MIT License

## More information
More details about the server-side API can be found [here](http://imagetyperz.com)


<sup><sub>captcha, bypasscaptcha, decaptcher, decaptcha, 2captcha, deathbycaptcha, anticaptcha, 
bypassrecaptchav2, bypassnocaptcharecaptcha, bypassinvisiblerecaptcha, captchaservicesforrecaptchav2, 
recaptchav2captchasolver, googlerecaptchasolver, recaptchasolverjavascript, recaptchabypassscript</sup></sub>

