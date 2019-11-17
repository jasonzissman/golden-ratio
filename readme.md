# Golden Ratio

This is a simple project meant to determine which subreddits have the highest gild-to-subscriber ratio.

To compute this ratio, we take (number of Gilds) / (number of subscribers x 10,000,000).

In human-readable form, this equates to number of gilds per 10,000,000 subscribers. The higher the number, the more gildings we see in relation to the subreddit's size.

To gather the data from reddit for today, run `node main.js`.

To compute reports off the gathered data, run `node result-reformatters\golden-ratio-all-time.js` or `node result-reformatters\golden-ratio-by-day.js`.

