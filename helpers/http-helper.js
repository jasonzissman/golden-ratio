const https = require("https");
const logger = require("./log-helper");

const _maxConcurrentRequests = 5;
const _checkConcurrentRequestsFreq = 250;
let _numberOpenRequests = 0;

let _attempRequest = (params, promiseResolve, promiseReject) => {

    var req = https.request(params, (res) => {

        if (res.statusCode < 200 || res.statusCode >= 300) {
            _numberOpenRequests -= 1;
            return promiseReject(new Error('statusCode=' + res.statusCode));
        }

        var body = [];
        res.on('data', (chunk) => {
            body.push(chunk);
        });

        res.on('end', () => {
            _numberOpenRequests -= 1;
            try {
                body = JSON.parse(Buffer.concat(body).toString());
            } catch (e) {
                logger.log("Failed to parse JSON response");
                promiseReject(e);
            }
            promiseResolve(body);
        });
    });

    req.on('error', (err) => {
        _numberOpenRequests -= 1;
        promiseReject(err);
    });

    let httpRequestCheckStatusIntervalId = setInterval(() => {
        if (_numberOpenRequests < _maxConcurrentRequests) {
            _numberOpenRequests += 1;
            clearInterval(httpRequestCheckStatusIntervalId);
            logger.log("Issuing HTTP request " + params.method + " " + params.host + ":" + params.port + params.path);
            req.end();
        }
    }, _checkConcurrentRequestsFreq);
};

module.exports = {

    issueHttpRequest: (params) => {

        return new Promise((resolve, reject) => {
            _attempRequest(params, resolve, reject);
        }).catch(() => {
            logger.log("REQUEST FAILED. Reattempting HTTP request " + params.method + " " + params.host + ":" + params.port + params.path);
            return new Promise((resolve2, reject2) => {
                _attempRequest(params, resolve2, reject2);
            })
        }).catch(() => {
            logger.log("REQUEST FAILED AGAIN. Last attempt for HTTP request " + params.method + " " + params.host + ":" + params.port + params.path);
            return new Promise((resolve3, reject3) => {
                _attempRequest(params, resolve3, reject3);
            })
        });
    }
};