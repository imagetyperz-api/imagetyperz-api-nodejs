const requestify = require('requestify');   // used for making web requests
const Q = require('q');
const config = require('./config');

exports.post = function (url, post_data) {
    var deferred = Q.defer();
    requestify.request(url, {
            method: 'POST',
            body: post_data,
            timeout: config.requests_timeout,
            dataType: 'form-url-encoded'
        }
    ).then(function (data) {
        if (data.body.indexOf('ERROR:') !== -1) return deferred.reject(data.body);
        return deferred.resolve(data.body);
    }).catch(function (err) {
        deferred.reject(err.message || err);
    });
    return deferred.promise;
}
;

exports.get = function (url) {
    var deferred = Q.defer();
    requestify.request(url,{
        method: 'GET',
        timeout: config.requests_timeout
    }).then(function (data) {
        if (data.body.indexOf('ERROR:') !== -1) return deferred.reject(data.body);
        return deferred.resolve(data.body);
    }).catch(function (err) {
        deferred.reject(err.message || err);
    });
    return deferred.promise;
};