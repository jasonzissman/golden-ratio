const subreddits = ["news", "funny", "politics"];
const https = require("https");

function issueHttpRequest(params) {

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

let allRequestPromises = [];
let output = {};

for (let i=0; i<subreddits.length; i++) {

    let subreddit = subreddits[i];

    let numberGuilds = 0;
    let subscribers = 0;

    var requestOptions = {
        host: `www.reddit.com`,
        method: 'GET',
        port:443,
        path: `/r/${subreddit}/.json`
    };

    let requestPromise = issueHttpRequest(requestOptions).then((subredditInfo) => {
        output[subreddit] = {
            numberGuilds: numberGuilds,
            subscribers: subscribers
        }
    });

    allRequestPromises.push(requestPromise);
}

Promise.all(allRequestPromises).then(() => {
    console.log("Results")
    console.log(JSON.stringify(output, null, 2));
}).catch((error) => {
    console.log("SOMETHING WENT WRONG!")
    console.log(JSON.stringify(error, null, 2));
});
