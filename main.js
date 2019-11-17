const fs = require('fs');
const httpHelper = require('./helpers/http-helper');
const redditDataHelper= require('./helpers/reddit-data-helper');
const logger = require('./helpers/log-helper');

const topSubreddits = ["announcements", "funny", "AskRddit", "gaming", "pics", "sciences", "worldnews", "aww",
    "movies", "todayilearned", "videos", "Music", "IAmA", "news", "gifs", "EarthPorn", "Showerthoughts",
    "askscience", "blog", "Jokes", "explainlikeimfive", "books", "food", "LifeProTips", "DIY", "mildlyinteresting",
    "Art", "sports", "space", "gadgets", "nottheonion", "television", "photoshopbattles", "Documentaries", "GetMotivated",
    "listentothis", "UpliftingNews", "tifu", "InternetIsBeautiful", "history", "Futurology", "philosophy", "OldSchoolCool",
    "WritingPrompts", "personalfinance", "dataisbeautiful", "nosleep", "creepy", "TwoXChromosomes", "technology",
    "AdviceAnimals", "Fitness", "memes", "WTF", "wholesomememes", "politics", "bestof", "interestingasfuck", "BlackPeopleTwitter",
    "oddlysatisfying"];

let allRequestPromises = [];
let output = {
    subreddits:{},
    timestamp: new Date().getTime()
};

for (let i = 0; i < topSubreddits.length; i++) {

    let subreddit = topSubreddits[i];
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
Promise.all(allRequestPromises).then(() => {
    
    logger.log("All HTTP responses received. Computing golden ratio for each subreddit.")
    for (const subreddit in output["subreddits"]) {
        output["subreddits"][subreddit]["goldenRatio"] = output["subreddits"][subreddit]["numberGilds"] / (output["subreddits"][subreddit]["subscribers"] / 1000000);
    }

    const fileName = "results\\" + new Date().toISOString().split('T')[0] + ".json";
    
    logger.log("Processing complete. Writing results to " + fileName);
    fs.writeFileSync(fileName, JSON.stringify(output, null, 2));
    
    logger.log("Results written.")
    
}).catch((error) => {
    logger.log("Something went wrong. Aborting!")
    logger.log(JSON.stringify(error, null, 2));
});
