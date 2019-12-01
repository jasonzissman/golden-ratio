# Golden Ratio

This is a simple project meant to determine which subreddits have the highest gild-to-subscriber ratio.

To compute this ratio, we take (number of Gilds) / (number of subscribers x 10,000,000).

In human-readable form, this equates to number of gilds per 10,000,000 subscribers. The higher the number, the more gildings we see in relation to the subreddit's size.

To gather the data from reddit for today, run `node main.js`.

To compute CSV reports off the gathered data, run one of the reports:

1. `node result-reformatters\golden-ratio-by-day-cumulative.js` (I think this is the most insightful)
2. `node result-reformatters\golden-ratio-all-time.js`
3. `node result-reformatters\golden-ratio-by-day.js`

# Analysis of Results
[2019-12-01 - Top 200 Most Subscribed](published-results/2019-12-01.md)

[2019-11-24 - Top 60 Most Subscribed](published-results/2019-11-24.md)
