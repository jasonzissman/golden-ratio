module.exports = {

    topSubreddits: ["announcements", "funny", "AskReddit", "gaming", "pics", "science", "worldnews", "aww",
        "movies", "todayilearned", "videos", "Music", "IAmA", "news", "gifs", "EarthPorn", "Showerthoughts",
        "askscience", "blog", "Jokes", "explainlikeimfive", "books", "food", "LifeProTips", "DIY", "mildlyinteresting",
        "Art", "sports", "space", "gadgets", "nottheonion", "television", "photoshopbattles", "Documentaries", "GetMotivated",
        "listentothis", "UpliftingNews", "tifu", "InternetIsBeautiful", "history", "Futurology", "philosophy", "OldSchoolCool",
        "WritingPrompts", "personalfinance", "dataisbeautiful", "nosleep", "creepy", "TwoXChromosomes", "technology",
        "AdviceAnimals", "Fitness", "memes", "WTF", "wholesomememes", "politics", "bestof", "interestingasfuck", "BlackPeopleTwitter",
        "oddlysatisfying"],

    countNumberGildsInPosts: function (posts) {
        let numberGilds = 0;
        for (let j = 0; j < posts.length; j++) {
            let post = posts[j];
            try {
                numberGilds += Number(post.data.gilded);
            } catch (error) {
                console.log("Could not parse gild property. Moving along");
            }
        }
        return numberGilds;
    }
};