// Reads all results and combines into CSV that can be parsed to
// create a bar chart of highest gold to subscriber ratio over specific
// time period

/**** Output should be CSV:
Subreddit,gildToSubscriberRatio
announcements,0.863120753288006
funny,0.545
AskReddit,0.546
gaming,0.04144638775043721
****/

const fs = require('fs');
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
let csvDataContainer = {};
for (let timestamp in allResultEntries) {
    let subreddits = allResultEntries[timestamp];
    for (let subreddit in subreddits) {
        if (!csvDataContainer[subreddit]) {
            csvDataContainer[subreddit] = [];
        }
        csvDataContainer[subreddit].push(subreddits[subreddit].goldenRatio);
    }
}

// 4. Calculate average golden ratio over all days
for (let subreddit in csvDataContainer) {
    let validEntries = csvDataContainer[subreddit].filter(x => x!==undefined);
    if (validEntries && validEntries.length > 0) {
        let average = validEntries.reduce((a, b) => a + b, 0) / validEntries.length;
        csvDataContainer[subreddit] = parseFloat(average.toFixed(8))
    } else {
        csvDataContainer[subreddit] = 0;
    }
}

// 5. Save as CSV file
let csvString = "Subreddit,averageGoldenRatio";
for (let i = 0; i < redditDataHelper.topSubreddits.length; i++) {
    let subreddit = redditDataHelper.topSubreddits[i];
    csvString += "\r\n";
    csvString += subreddit;
    csvString += ",";
    csvString += csvDataContainer[subreddit];
}

const fileName = "result-reformatters\\golden-ratio-all-time\\" + new Date().toISOString().split('T')[0] + ".csv";
logger.log("Processing complete. Writing results to " + fileName);

fs.writeFileSync(fileName, csvString);
