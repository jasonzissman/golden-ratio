module.exports = {
    countNumberGildsInPosts: function(posts) {
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