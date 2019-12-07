const fs = require('fs');
const ts = require("./helpers/timestamp-helper");
const httpHelper = require('./helpers/http-helper');
const redditDataHelper = require('./helpers/reddit-data-helper');
const logger = require('./helpers/log-helper');

const workingDirectory = process.argv[1].split("main.js")[0];
logger.setLogFilenameAndPath(workingDirectory + "log.txt");

let allRequestPromises = [];
let output = {
    subreddits: {},
    timestamp: new Date().getTime()
};

for (let i = 0; i < redditDataHelper.subredditsToMeasure.length; i++) {

    let subreddit = redditDataHelper.subredditsToMeasure[i];
    output["subreddits"][subreddit] = {
        numberGilds: undefined,
        numberGildsInComments: 0
    };

    // Get number of gilds on current top posts
    var getPostsRequestOptions = {
        host: `www.reddit.com`,
        method: 'GET',
        port: 443,
        path: `/r/${subreddit}/.json`
    };
    
    allRequestPromises.push(httpHelper.issueHttpRequest(getPostsRequestOptions).then((subredditInfo) => {
        let posts = subredditInfo.data.children;
        output["subreddits"][subreddit]["aggregatedTitles"] = redditDataHelper.aggregateAllPostTitles(posts);
        output["subreddits"][subreddit]["numberGilds"] = redditDataHelper.countNumberGildsInPosts(posts);
        
        // count gilds in highest upvoted 5 comments
        const postUrls = redditDataHelper.getPostUrls(posts);
        let fetchPostCommentsRequests = [];
        for(let k=0; k<postUrls.length; k++) {
            const postUrl = postUrls[k];
            var getPostRequestOptions = {
                host: `www.reddit.com`,
                method: 'GET',
                port: 443,
                path: encodeURI(postUrl) + ".json"
            };
            fetchPostCommentsRequests.push(httpHelper.issueHttpRequest(getPostRequestOptions).then(postData => {
                output["subreddits"][subreddit]["numberGildsInRootComments"] += redditDataHelper.countNumberGildsInPostComments(postData, 5);
            }).catch(error => {
                // Failed to fetch comment data... move along
            }));
        };
        return Promise.all(fetchPostCommentsRequests);
    }).catch(() => {
        logger.log("ERROR - Could not get top posts info for " + subreddit + ". Skipping...");
    }));


    // Get general subreddit info
    var getSubscribersRequestOptions = {
        host: `www.reddit.com`,
        method: 'GET',
        port: 443,
        path: `/r/${subreddit}/about.json`
    };

    allRequestPromises.push(httpHelper.issueHttpRequest(getSubscribersRequestOptions).then((subredditInfo) => {
        output["subreddits"][subreddit]["subscribers"] = subredditInfo.data.subscribers;
        output["subreddits"][subreddit]["accounts_active"] = subredditInfo.data.accounts_active;
        output["subreddits"][subreddit]["accounts_active_is_fuzzed"] = subredditInfo.data.accounts_active_is_fuzzed;
    }).catch(() => {
        logger.log("ERROR - Could not get subscriber info for " + subreddit + ". Skipping...");
    }));

}

Promise.all(allRequestPromises).then(() => {

    logger.log("All HTTP responses received. Computing golden ratio for each subreddit.")
    for (const subreddit in output["subreddits"]) {
        output["subreddits"][subreddit]["goldenRatio"] = output["subreddits"][subreddit]["numberGilds"] / (output["subreddits"][subreddit]["subscribers"] / 10000000);
    }

    const fileName = workingDirectory + "results\\" + ts.dateOnlyTimestamp() + ".json";
    logger.log("Processing complete. Writing results to " + fileName);
    fs.writeFileSync(fileName, JSON.stringify(output, null, 2));
    logger.log("Results written.")
});
