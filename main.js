const fs = require('fs');
const https = require("https");

const topSubreddits = ["announcements", "funny", "AskRddit", "gaming", "pics", "sciences", "worldnews", "aww",
    "movies", "todayilearned", "videos", "Music", "IAmA", "news", "gifs", "EarthPorn", "Showerthoughts",
    "askscience", "blog", "Jokes", "explainlikeimfive", "books", "food", "LifeProTips", "DIY", "mildlyinteresting",
    "Art", "sports", "space", "gadgets", "nottheonion", "television", "photoshopbattles", "Documentaries", "GetMotivated",
    "listentothis", "UpliftingNews", "tifu", "InternetIsBeautiful", "history", "Futurology", "philosophy", "OldSchoolCool",
    "WritingPrompts", "personalfinance", "dataisbeautiful", "nosleep", "creepy", "TwoXChromosomes", "technology",
    "AdviceAnimals", "Fitness", "memes", "WTF", "wholesomememes", "politics", "bestof", "interestingasfuck", "BlackPeopleTwitter",
    "oddlysatisfying"];
    
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
let output = {
    subreddits:{},
    timestamp: new Date().getTime()
};

console.log("Starting to process subreddits");

for (let i = 0; i < topSubreddits.length; i++) {

    let subreddit = topSubreddits[i];
    output["subreddits"][subreddit] = {
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
                output["subreddits"][subreddit]["numberGilds"] += Number(post.data.gilded);
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
        output["subreddits"][subreddit]["subscribers"] = subredditInfo.data.subscribers;
        output["subreddits"][subreddit]["accounts_active"] = subredditInfo.data.accounts_active;
        output["subreddits"][subreddit]["accounts_active_is_fuzzed"] = subredditInfo.data.accounts_active_is_fuzzed;
    });

    allRequestPromises.push(getSubscribersRequestPromise);

}

Promise.all(allRequestPromises).then(() => {

    for (const subreddit in output["subreddits"]) {
        output["subreddits"][subreddit]["goldenRatio"] = output["subreddits"][subreddit]["numberGilds"] / (output["subreddits"][subreddit]["subscribers"] / 1000000);
    }

    const fileName = "results\\" + new Date().toDateString().replace(/\ /g, '-') + ".json";
    console.log("Writing results to file");
    fs.writeFileSync(JSON.stringify(fileName), output);
    console.log("Results")

    console.log(JSON.stringify(output, null, 2));
}).catch((error) => {
    console.log("SOMETHING WENT WRONG!")
    console.log(JSON.stringify(error, null, 2));
});
