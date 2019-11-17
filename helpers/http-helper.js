const https = require("https");

module.exports = {
    issueHttpRequest: function (params) {

        return new Promise(function (resolve, reject) {

            var req = https.request(params, function (res) {

                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('statusCode=' + res.statusCode));
                }

                var body = [];
                res.on('data', function (chunk) {
                    body.push(chunk);
                });

                res.on('end', function () {
                    try {
                        body = JSON.parse(Buffer.concat(body).toString());
                    } catch (e) {
                        console.log("Failed to parse JSON response");
                        reject(e);
                    }
                    resolve(body);
                });
            });

            req.on('error', function (err) {
                reject(err);
            });

            req.end();
        });
    }
};