// Reads all results and combines into CSV that can be easily parsed by
// Flourish to create a bar chart race for the cumulative average each day.

/**** Output should be CSV:
Subreddit,2019-11-16,2019-11-17,2019-11-18,2019-11-19
announcements,0.863120753288006,xxxx,xxxx,xxxx
funny,0,xxxx,xxxx,xxxx
AskReddit,0,xxxx,xxxx,xxxx
gaming,0.04144638775043721,xxxx,xxxx,xxxx
****/

/***** Output visualized in human readable format:
Subreddit	           2019-11-16	        2019-11-17	2019-11-18	2019-11-19
announcements          0.863120753288006   xxxx        xxxx        xxxx
funny    	    	   0                   xxxx        xxxx        xxxx
AskReddit	    	   0                   xxxx        xxxx        xxxx
gaming                 0.04144638775043721 xxxx        xxxx        xxxx
*****/

const fs = require('fs');
const ts = require("../helpers/timestamp-helper");
const logger = require('../helpers/log-helper');
const redditDataHelper = require('../helpers/reddit-data-helper');

// 1. Get filenames for all results
const directory = "./results";
logger.log("Reading directory listing for " + directory);
const allResultFileNames = fs.readdirSync(directory);
logger.log("Files found: " + allResultFileNames);

// 2. Read each result file
let allResultEntries = {};
allResultFileNames.forEach((filename) => {
    let resultDataStr = fs.readFileSync(directory + "/" + filename);
    let resultData = JSON.parse(resultDataStr);
    allResultEntries[filename.replace(".json", "")] = resultData.subreddits;
    logger.log("Successfully read " + filename);
});

// 3. Add data rows to CSV-compatible object
let numberOfValidEntries = {};
let csvDataContainer = {};
let csvString = "Subreddit";

let timestamps = Object.keys(allResultEntries);
for(let i=0; i<timestamps.length; i++) {
    let timestamp = timestamps[i];
    let priorTimestamp = undefined;
    if (i > 0) {
        priorTimestamp = timestamps[i-1];
    }
    csvString += ",";
    csvString += timestamp;
    let subreddits = allResultEntries[timestamp];
    for (let subreddit in subreddits) {
        if (!csvDataContainer[timestamp]) {
            csvDataContainer[timestamp] = {};
        }
        if (numberOfValidEntries[subreddit] === undefined) {
            numberOfValidEntries[subreddit] = 0;
        }
        if (subreddits[subreddit].goldenRatio !== undefined) {
            numberOfValidEntries[subreddit] += 1;
        }

        let cumulativeValue = subreddits[subreddit].goldenRatio;
        if (priorTimestamp && csvDataContainer[priorTimestamp] !== undefined && csvDataContainer[priorTimestamp][subreddit] !== undefined && subreddits[subreddit].goldenRatio !== undefined) {
            cumulativeValue = ((numberOfValidEntries[subreddit]-1)*csvDataContainer[priorTimestamp][subreddit] + subreddits[subreddit].goldenRatio) / numberOfValidEntries[subreddit];
        } else if (priorTimestamp && csvDataContainer[priorTimestamp] !== undefined && csvDataContainer[priorTimestamp][subreddit] !== undefined) {
            cumulativeValue = csvDataContainer[priorTimestamp][subreddit];
        } 

        csvDataContainer[timestamp][subreddit] = cumulativeValue;
    }
}

// 4. Save as CSV file
for (let i = 0; i < redditDataHelper.topSubreddits.length; i++) {
    let subreddit = redditDataHelper.topSubreddits[i];
    csvString += "\r\n";
    csvString += subreddit;
    for (let timestamp in csvDataContainer) {
        csvString += ",";
        csvString += csvDataContainer[timestamp][subreddit];
    }
}

const fileName = "result-reformatters\\golden-ratio-by-day-cumulative\\" + ts.dateOnlyTimestamp() + ".csv";
logger.log("Processing complete. Writing results to " + fileName);
fs.writeFileSync(fileName, csvString);
