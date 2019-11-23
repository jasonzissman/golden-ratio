const https = require("https");
const logger = require("./log-helper");

const _maxConcurrentRequests = 5;
const _checkConcurrentRequestsFreq = 250;
let _numberOpenRequests = 0;

module.exports = {

    
    issueHttpRequest: (params) => {

        return new Promise((resolve, reject) => {            

            var req = https.request(params, (res) => {


                if (res.statusCode < 200 || res.statusCode >= 300) {
                    _numberOpenRequests -=1;

                    return reject(new Error('statusCode=' + res.statusCode));
                }

                var body = [];
                res.on('data', (chunk) => {
                    body.push(chunk);
                });

                res.on('end', () => {
                    _numberOpenRequests -=1;
                    try {
                        body = JSON.parse(Buffer.concat(body).toString());
                    } catch (e) {
                        logger.log("Failed to parse JSON response");
                        reject(e);
                    }
                    resolve(body);
                });
            });

            req.on('error', (err) => {
                _numberOpenRequests -=1;
                reject(err);
            });

            let httpRequestCheckStatusIntervalId = setInterval(() => {
                if (_numberOpenRequests < _maxConcurrentRequests) {
                    _numberOpenRequests += 1;
                    clearInterval(httpRequestCheckStatusIntervalId);                    
                    logger.log("Issuing HTTP request " + params.method + " " + params.host + ":" + params.port + params.path);
                    req.end();
                }
            }, _checkConcurrentRequestsFreq);
        });
    }
};