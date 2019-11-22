const fs = require('fs');
const ts = require("./helpers/timestamp-helper");
const httpHelper = require('./helpers/http-helper');
const redditDataHelper = require('./helpers/reddit-data-helper');
const logger = require('./helpers/log-helper');

const workingDirectory = process.argv[1].split("main.js")[0];
logger.setLogFilenameAndPath(workingDirectory + "log.txt");

let executeMainRoutine = () => {

    let allRequestPromises = [];
    let output = {
        subreddits:{},
        timestamp: new Date().getTime()
    };
    
    for (let i = 0; i < redditDataHelper.topSubreddits.length; i++) {
    
        let subreddit = redditDataHelper.topSubreddits[i];
        output["subreddits"][subreddit] = {
            numberGilds: 0
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
            output["subreddits"][subreddit]["numberGilds"] = redditDataHelper.countNumberGildsInPosts(posts);
        }));
       
        // Get general subreddit info
        var getSubscribersRequestOptions = {
            host: `www.reddit.com`,
            method: 'GET',
            port: 443,
            path: `/r/${subreddit}/about.json`
        };
    
        let getSubscribersRequestPromise = httpHelper.issueHttpRequest(getSubscribersRequestOptions).then((subredditInfo) => {
            output["subreddits"][subreddit]["subscribers"] = subredditInfo.data.subscribers;
            output["subreddits"][subreddit]["accounts_active"] = subredditInfo.data.accounts_active;
            output["subreddits"][subreddit]["accounts_active_is_fuzzed"] = subredditInfo.data.accounts_active_is_fuzzed;
        });
    
        allRequestPromises.push(getSubscribersRequestPromise);
    }
    
    logger.log("All HTTP requests sent. Waiting for responses.")
    
    return Promise.all(allRequestPromises).then(() => {
        
        logger.log("All HTTP responses received. Computing golden ratio for each subreddit.")
        for (const subreddit in output["subreddits"]) {
            output["subreddits"][subreddit]["goldenRatio"] = output["subreddits"][subreddit]["numberGilds"] / (output["subreddits"][subreddit]["subscribers"] / 10000000);
        }
    
        const fileName = workingDirectory + "results\\" + ts.dateOnlyTimestamp() + ".json";
        
        logger.log("Processing complete. Writing results to " + fileName);
        fs.writeFileSync(fileName, JSON.stringify(output, null, 2));
        
        logger.log("Results written.")
        
    });
    
};



executeMainRoutine().catch((error) => {
    logger.log("Something went wrong. Trying again!")
    logger.log(JSON.stringify(error, null, 2));
    executeMainRoutine().catch((error2) => {
        logger.log("Something went wrong. Trying one more time...")
        logger.log(JSON.stringify(error2, null, 2));
        executeMainRoutine().catch((error3) => {
            logger.log("Something went wrong. Aborting!");
            logger.log(JSON.stringify(error3, null, 2));
        }); 
    }); 
});

