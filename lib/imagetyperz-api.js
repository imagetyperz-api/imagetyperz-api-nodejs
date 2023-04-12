const requests = require('./requests');
const endpoints = require('./endpoints');   // endpoints of API

const fs = require('fs');
const Q = require('q');

const HEADERS = {
    'User-Agent': 'nodeAPIv1.0'
};

// private variables
var _access_key = undefined, _username = undefined, _password = undefined,
    _affiliate_id = undefined;

/**
 * Set access key
 * @param access_key
 */
exports.set_access_key = function (access_key) {
    _access_key = access_key;
};

/**
 * Set username and password
 * @param user
 * @param password
 */
exports.set_user_password = function (user, password) {
    _username = user;
    _password = password;
};

/**
 * Set affiliate id
 * @param aff_id
 */
exports.set_affiliate_id = function (aff_id) {
    _affiliate_id = aff_id;
};

/**
 * Get account balance
 * @returns {*}
 */
exports.account_balance = function () {
    var deferred = Q.defer();
    var data = {}, url = undefined;
    if (_username && _password) {
        url = endpoints.BALANCE_ENDPOINT;
        // legacy auth
        data['username'] = _username;
        data['password'] = _password;
    }
    else {
        url = endpoints.BALANCE_ENDPOINT_TOKEN;
        data['token'] = _access_key;    // token auth
    }

    // add rest of params
    data['action'] = 'REQUESTBALANCE';
    data['submit'] = 'Submit';

    var params = serialize_dict(data);

    // submit to server
    requests.get(url + "?" + params, {headers: HEADERS}).then(function (resp) {
        deferred.resolve(resp);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_image = function (image, optional_parameters) {
    var deferred = Q.defer();
    var data = {}, url = undefined, img_data = undefined;
    if (_username && _password) {
        // legacy auth
        data['username'] = _username;
        data['password'] = _password;
        url = endpoints.CAPTCHA_ENDPOINT;
        if (!fs.existsSync(image)) {
            // image does not exist
            deferred.reject(new Error('image does not exist: ' + image));
            return deferred.promise;
        }
        // get b64 of image
        img_data = base64_encode(image);
    }
    else {
        // given image is URL (works only for token based auth currently)
        if (image.startsWith('http')) {
            url = endpoints.CAPTCHA_ENDPOINT_URL_TOKEN;
            img_data = image;
        }
        else {
            // token based auth and file image
            url = endpoints.CAPTCHA_ENDPOINT_CONTENT_TOKEN;
            if (!fs.existsSync(image)) {
                // image does not exist
                deferred.reject(new Error('image does not exist: ' + image));
                return deferred.promise;
            }
            img_data = base64_encode(image);
        }
        data['token'] = _access_key;
    }

    // add rest of params
    data['action'] = 'UPLOADCAPTCHA';
    data['file'] = img_data;

    // optional parameters
    let optional_keys = Object.keys(optional_parameters);
    // check if any given
    if(optional_keys.length > 0){
        let i = 0;
        for(i = 0; i < optional_keys.length; i++){
            let key = optional_keys[i];
            data[key] = optional_parameters[key];
        }
    }

    // check for affiliate id
    if (_affiliate_id) data['affiliateid'] = _affiliate_id;

    // submit to server
    requests.post(url, data).then(function (resp) {
        var s = resp.split('|');
        deferred.resolve(s[0]);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_recaptcha = function (d) {
    var page_url = d.page_url;
    var sitekey = d.sitekey;
    var proxy = d.proxy;
    var deferred = Q.defer();
    var data = {}, url = undefined;
    if (_username && _password) {
        // legacy auth
        data['username'] = _username;
        data['password'] = _password;
        url = endpoints.RECAPTCHA_SUBMIT_ENDPOINT;
    }
    else {
        // token auth
        data['token'] = _access_key;
        url = endpoints.RECAPTCHA_SUBMIT_ENDPOINT_TOKEN;
    }

    // check for proxy
    if (proxy) {
        data['proxy'] = proxy;
        data['proxytype'] = 'HTTP';
    }

    // add rest of params
    data['action'] = 'UPLOADCAPTCHA';
    data['pageurl'] = page_url;
    data['googlekey'] = sitekey;

    // check for affiliate id
    if (_affiliate_id) data['affiliateid'] = _affiliate_id;

    // user agent
    if (d.user_agent) data.useragent = d.user_agent;
    // custom domain for loading reCAPTCHA interface
    if (d.domain) data.domain = d.domain;
    // type / enterprise
    if (d.type) {
        data.recaptchatype = d['type'];
        const ts = d['type'].toString()
        if (ts === '4' || ts === '5') url = endpoints.RECAPTCHA_ENTERPRISE_SUBMIT_ENDPOINT
        if (ts === '5') data.enterprise_type = 'v3'
    }
    if (d.v3_action) data.captchaaction = d['v3_action'];
    if (d.v3_min_score) data.score = d['v3_min_score'];
    if (d.data_s) data['data-s'] = d.data_s;
    if (d.cookie_input) data['cookie_input'] = d.cookie_input;

    // submit to server
    requests.post(url, data).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(ss);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_geetest = function (d) {
    var deferred = Q.defer();
    var url = undefined;
    // check for required fields
    if(!d.domain) deferred.reject('domain is missing');
    if(!d.challenge) deferred.reject('challenge is missing');
    if(!d.gt) deferred.reject('gt is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
        url = endpoints.GEETEST_SUBMIT_ENDPOINT
    }
    else {
        // token auth
        d['token'] = _access_key;
        url = endpoints.GEETEST_SUBMIT_ENDPOINT_TOKEN;
    }
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;

    url = url + "?" + serialize_dict(d);
    // submit to server
    requests.get(url).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(ss);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_geetest_v4 = function (d) {
    var deferred = Q.defer();
    var url = undefined;
    // check for required fields
    if(!d.domain) deferred.reject('domain is missing');
    if(!d.geetestid) deferred.reject('geetestid is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    url = endpoints.GEETEST_V4_SUBMIT_ENDPOINT
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;

    url = url + "?" + serialize_dict(d);
    // submit to server
    requests.get(url).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(ss);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_capy = function (d) {
    var deferred = Q.defer();
    var url = undefined;
    // check for required fields
    if(!d.page_url) deferred.reject('page_url is missing');
    if(!d.sitekey) deferred.reject('sitekey is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    // server needs it like this, but our convention was page_url at 1st
    d['pageurl'] = d['page_url']
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    d['captchatype'] = 12
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;

    // submit to server
    requests.post(endpoints.CAPY_ENDPOINT, d).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(JSON.parse(ss)[0].CaptchaId)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_hcaptcha = function (d) {
    var deferred = Q.defer();
    // check for required fields
    if(!d.page_url) deferred.reject('page_url is missing');
    if(!d.sitekey) deferred.reject('sitekey is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    // server needs it like this, but our convention was page_url at 1st
    d['pageurl'] = d['page_url']
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    d['captchatype'] = 11
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;
    if (d.HcaptchaEnterprise) d.HcaptchaEnterprise = JSON.stringify(d.HcaptchaEnterprise)
    if (d.domain) {
        d.apiEndpoint = d.domain
        delete d.domain
    }

    // submit to server
    requests.post(endpoints.HCAPTCHA_ENDPOINT, d).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(JSON.parse(ss)[0].CaptchaId)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_tiktok = function (d) {
    var deferred = Q.defer();
    var url = undefined;
    // check for required fields
    if(!d.page_url) deferred.reject('page_url is missing');
    if(!d.cookie_input) deferred.reject('cookie_input is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    // server needs it like this, but our convention was page_url at 1st
    d['pageurl'] = d['page_url']
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    d['captchatype'] = 12
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;

    // submit to server
    requests.post(endpoints.TIKTOK_ENDPOINT, d).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(JSON.parse(ss)[0].CaptchaId)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_funcaptcha = function (d) {
    var deferred = Q.defer();
    // check for required fields
    if(!d.page_url) deferred.reject('page_url is missing');
    if(!d.sitekey) deferred.reject('sitekey is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    if (d.s_url) d['surl'] = d['s_url'];
    // server needs it like this, but our convention was page_url at 1st
    d['pageurl'] = d['page_url']
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    d['captchatype'] = 13
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;

    // submit to server
    requests.post(endpoints.FUNCAPTCHA_ENDPOINT, d).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(JSON.parse(ss)[0].CaptchaId)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_turnstile = function (d) {
    var deferred = Q.defer();
    var url = undefined;
    // check for required fields
    if(!d.page_url) deferred.reject('page_url is missing');
    if(!d.sitekey) deferred.reject('sitekey is missing');
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    // server needs it like this, but our convention was page_url at 1st
    d['pageurl'] = d['page_url']
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;
    if (d.domain) {
        d.apiEndpoint = d.domain
        delete d.domain
    }
    if (d.action) {
        d.taction = d.action
        delete d.action
    }
    if (d.cdata) {
        d.data = d.cdata
        delete d.cdata
    }


    d['action'] = 'UPLOADCAPTCHA';
    // submit to server
    requests.post(endpoints.TURNSTILE_ENDPOINT, d).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(JSON.parse(ss)[0].CaptchaId)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.submit_task = function (d) {
    var deferred = Q.defer();
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    // server needs it like this, but our convention was page_url at 1st
    d['pageurl'] = d['page_url']
    // add rest of params
    d['action'] = 'UPLOADCAPTCHA';
    d['captchatype'] = 16
    if (d.variables) {
        d.variables = JSON.stringify(d.variables)
    }
    // check for affiliate id
    if (_affiliate_id) d['affiliateid'] = _affiliate_id;

    // submit to server
    requests.post(endpoints.TASK_ENDPOINT, d).then(function (resp) {
        var s = resp.split('|');
        var ss = s.length >= 2 ? s[1] : s[0];
        deferred.resolve(JSON.parse(ss)[0].CaptchaId)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.task_push_variables = function (captchaID, variables) {
    var deferred = Q.defer();
    const d = {}
    if (_username && _password) {
        // legacy auth
        d['username'] = _username;
        d['password'] = _password;
    }
    else {
        // token auth
        d['token'] = _access_key;
    }
    d['action'] = 'GETTEXT';
    d['captchaid'] = captchaID
    d.pushVariables = JSON.stringify(variables)

    // submit to server
    requests.post(endpoints.TASK_PUSH_ENDPOINT, d).then(function (resp) {
        if (resp.includes('Error'))
            return deferred.reject(Error(resp.split('Error:')[1].trim()))
        deferred.resolve(resp)
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * Set captcha bad
 * @param captcha_id
 * @returns {*}
 */
exports.set_captcha_bad = function (captcha_id) {
    var deferred = Q.defer();
    var data = {}, url = undefined;
    if (_username && _password) {
        url = endpoints.BAD_IMAGE_ENDPOINT;
        // legacy auth
        data['username'] = _username;
        data['password'] = _password;
    }
    else {
        url = endpoints.BAD_IMAGE_ENDPOINT_TOKEN;
        data['token'] = _access_key;    // token auth
    }

    // add rest of params
    data['action'] = 'SETBADIMAGE';
    data['imageid'] = captcha_id;
    data['submit'] = 'Submissssst';

    // submit to server
    requests.post(url, data, {headers: HEADERS}).then(function (resp) {
        deferred.resolve(resp);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.retrieve_response = async function (captcha_id) {
    var data = {}, url = undefined;
    if (_username && _password) {
        // legacy auth
        data['username'] = _username;
        data['password'] = _password;
    }
    else {
        data['token'] = _access_key;    // token auth
    }

    // add rest of params
    data['action'] = 'GETTEXT';
    data['captchaid'] = captcha_id;
    const deferred = Q.defer()
    // submit to server
    async function _checkResponse () {
        let req_resp
        try {
            req_resp = await requests.post(endpoints.RETRIEVE_JSON_ENDPOINT, data, {headers: HEADERS})
        } catch (err) {
            // give the best possible error output
            try {
                deferred.resolve(JSON.parse(err.message))
            } catch (err2) {
                try {
                    deferred.resolve(JSON.parse(err))
                } catch (err3) {
                    deferred.resolve(err.message || err)
                }
            }
            return deferred.promise
        }
        const resp = JSON.parse(req_resp)[0]
        if (resp.Status !== 'Pending') {
            deferred.resolve(resp)
            return deferred.promise;
        }
        // if still pending, recheck in 10 secs
        setTimeout(_checkResponse, 10000)
        return deferred.promise
    }
    return await _checkResponse()
}

/**
 * Utils
 */
function serialize_dict(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
