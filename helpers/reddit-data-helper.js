module.exports = {

    subredditsToMeasure: [
        "announcements",
        "funny",
        "AskReddit",
        "gaming",
        "pics",
        "science",
        "worldnews",
        "aww",
        "movies",
        "todayilearned",
        "videos",
        "Music",
        "IAmA",
        "news",
        "gifs",
        "EarthPorn",
        "Showerthoughts",
        "askscience",
        "blog",
        "Jokes",
        "explainlikeimfive",
        "books",
        "food",
        "LifeProTips",
        "DIY",
        "mildlyinteresting",
        "Art",
        "sports",
        "space",
        "gadgets",
        "nottheonion",
        "television",
        "photoshopbattles",
        "Documentaries",
        "GetMotivated",
        "listentothis",
        "UpliftingNews",
        "tifu",
        "InternetIsBeautiful",
        "history",
        "Futurology",
        "philosophy",
        "OldSchoolCool",
        "WritingPrompts",
        "personalfinance",
        "dataisbeautiful",
        "nosleep",
        "creepy",
        "TwoXChromosomes",
        "technology",
        "AdviceAnimals",
        "Fitness",
        "memes",
        "WTF",
        "wholesomememes",
        "politics",
        "bestof",
        "interestingasfuck",
        "BlackPeopleTwitter",
        "oddlysatisfying",
        "nba",
        "HongKong",
        "leagueoflegends",
        "travel",
        "lifehacks",
        "facepalm",
        "dankmemes",
        "pcmasterrace",
        "me_irl",
        "NatureIsFuckingLit",
        "Tinder",
        "nba",
        "woahdude",
        "PS4",
        "AnimalsBeingBros",
        "Whatcouldgowrong",
        "relationships",
        "AnimalsBeingJerks",
        "tattoos",
        "Overwatch",
        "FoodPorn",
        "reactiongifs",
        "atheism",
        "trippinthroughtime",
        "BikiniBottomTwitter",
        "Unexpected",
        "gonewild",
        "programming",
        "PewdiepieSubmissions",
        "gameofthrones",
        "boardgames",
        "relationship_advice",
        "europe",
        "malefashionadvice",
        "gardening",
        "Minecraft",
        "pokemongo",
        "instant_regret",
        "photography",
        "dadjokes",
        "Games",
        "mildlyinfuriating",
        "iphone",
        "Damnthatsinteresting",
        "pokemon",
        "loseit",
        "Android",
        "itookapicture",
        "CrappyDesign",
        "nonononoyes",
        "AnimalsBeingDerps",
        "rarepuppers",
        "hiphopheads",
        "drawing",
        "Wellthatsucks",
        "GifRecipes",
        "slowcooking",
        "buildapc",
        "ContagiousLaughter",
        "humor",
        "soccer",
        "offmychest",
        "trashy",
        "BetterEveryLoop",
        "woodworking",
        "Eyebleach",
        "confession",
        "RoastMe",
        "BeAmazed",
        "xboxone",
        "nfl",
        "cars",
        "pcgaming",
        "MakeupAddiction",
        "Roadcam",
        "ChoosingBeggars",
        "keto",
        "WatchPeopleDieInside",
        "HighQualityGifs",
        "NetflixBestOf",
        "YouShouldKnow",
        "raspberry_pi",
        "teenagers",
        "cats",
        "OutOfTheLoop",
        "EatCheapAndHealthy",
        "ChildrenFallingOver",
        "nsfw",
        "backpacking",
        "HumansBeingBros",
        "HistoryPorn",
        "AmItheAsshole",
        "blackmagicfuckery",
        "PublicFreakout",
        "Parenting",
        "biology",
        "RealGirls",
        "MadeMeSmile",
        "NSFW_GIF",
        "AskMen",
        "NintendoSwitch",
        "frugalmalefashion",
        "insanepeoplefacebook",
        "nevertellmetheodds",
        "Cooking",
        "youseeingthisshit",
        "trees",
        "streetwear",
        "MurderedByWords",
        "rickandmorty",
        "mac",
        "sex",
        "DnD",
        "ArtisanVideos",
        "KidsAreFuckingStupid",
        "WhitePeopleTwitter",
        "recipes",
        "therewasanattempt",
        "hmmm",
        "nextfuckinglevel",
        "IdiotsInCars",
        "MovieDetails",
        "NoStupidQuestions",
        "nintendo",
        "electronicmusic",
        "whatisthisthing",
        "reallifedoodles",
        "quityourbullshit",
        "battlestations",
        "scifi",
        "comics",
        "Awwducational",
        "TrollYChromosome",
        "anime",
        "FiftyFifty",
        "natureismetal",
        "madlads",
        "wow",
        "MealPrepSunday",
        "howto",
        "educationalgifs",
        "socialskills"
    ],
    countNumberGildsInPostsAndComments: (posts) => {
        let numberGildsInPosts = 0;
        let numberGildsInComments = 0;
        for (let j = 0; j < posts.length; j++) {
            let post = posts[j];
            try {
                numberGildsInPosts += Number(post.data.gilded);
            } catch (error) {
                console.log("Could not parse gild property. Moving along");
            }
            try {
                //1. Extract post.data.url
                //2. HTTP request against URL
                //3. Response is array. Comments are response[1].data.children, another array
                //4. This first children array are first generation comments, with data.gilded properties.
                //5. Recursively, each comment item has a data.replies array which itself contains 2nd generation comments                

                //
                //
                // Example (reduced)
                //
                //

                let responseFromPostUrl = [{
                    // first object in array is post metadata
                }, {
                    // second object in array is comment data
                    "kind": "Listing",
                    "data": {
                        "children": [{
                            "gilded": "2",
                            "replies": [
                                // second generation comments
                                {
                                    "data": {
                                        // ...
                                    }
                                }
                            ]
                        }
                        ]
                    }
                }];
            } catch (error) {
                console.log("Could not parse gild property. Moving along");
            }

        }
        return numberGildsInPosts + numberGildsInComments;
    },
    countNumberGildsInPosts: (posts) => {
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
    },
    aggregateAllPostTitles: (posts) => {
        let titles = "";
        for (let j = 0; j < posts.length; j++) {
            titles += "===";
            titles += posts[j].data.title;
        }
        return titles;
    },
    getFormattedSizeRange: (subscriberCount) => {
        const lowerEnd = 5 * Math.floor(subscriberCount / 5000000);
        return lowerEnd + "-" + (lowerEnd + 5);
    }
};