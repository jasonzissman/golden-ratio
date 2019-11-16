const subreddits = ["news", "funny", "politics"];
const https = require("https");

function issueHttpRequest(params) {

    // TODO - put in throttle here so that we only have X active requests simultaneously.
    // Consider returning a promise that actually executes the HTTP request when
    // there are less than 10 active.

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

for (let i = 0; i < subreddits.length; i++) {

    let subreddit = subreddits[i];
    output[subreddit] = {
        numberGilds: 0
    };

    var getPostsRequestOptions = {
        host: `www.reddit.com`,
        method: 'GET',
        port: 443,
        path: `/r/${subreddit}/.json`
    };

    let getPostsRequestPromise = issueHttpRequest(getPostsRequestOptions).then((subredditInfo) => {

        let posts = subredditInfo.data.children;

        for (let j = 0; j < posts.length; j++) {
            let post = posts[j];
            try {
                output[subreddit]["numberGilds"] += Number(post.data.gilded);
            } catch (error) {
                console.log("Could not parse gild property. Moving along");
            }
        }
    });

    allRequestPromises.push(getPostsRequestPromise);

    var getSubscribersRequestOptions = {
        host: `www.reddit.com`,
        method: 'GET',
        port: 443,
        path: `/r/${subreddit}/about.json`
    };

    let getSubscribersRequestPromise = issueHttpRequest(getSubscribersRequestOptions).then((subredditInfo) => {
        output[subreddit]["subscribers"] = subredditInfo.data.subscribers;
        output[subreddit]["accounts_active"] = subredditInfo.data.accounts_active;
        output[subreddit]["accounts_active_is_fuzzed"] = subredditInfo.data.accounts_active_is_fuzzed;
    });

    allRequestPromises.push(getSubscribersRequestPromise);

}

Promise.all(allRequestPromises).then(() => {

    for (const subreddit in output) {
        output[subreddit]["goldenRatio"] = output[subreddit]["numberGilds"] / (output[subreddit]["subscribers"]/1000000);
    }

    console.log("Results")
    console.log(JSON.stringify(output, null, 2));
}).catch((error) => {
    console.log("SOMETHING WENT WRONG!")
    console.log(JSON.stringify(error, null, 2));
});
