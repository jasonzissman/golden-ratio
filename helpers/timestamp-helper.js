module.exports = {
    fullTimestamp: function() {
        // 2019-11-23 16:13:30:696
        let now = new Date();
        return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + 
            " " +now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + ":" + now.getMilliseconds();
    },
    dateOnlyTimestamp: function() {
        // 2019-11-20
        let now = new Date();
        return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    }
};