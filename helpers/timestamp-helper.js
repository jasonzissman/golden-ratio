module.exports = {
    fullTimestamp: function() {
        // 2019-11-23 02:03:09:696
        let now = new Date();
        return now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
            String(now.getHours()).padStart(2, '0') + ":" + 
            String(now.getMinutes()).padStart(2, '0') + ":" +
            String(now.getSeconds()).padStart(2, '0') + ":" +              
            String(now.getMilliseconds()).padStart(3, '0'); 
    },
    dateOnlyTimestamp: function() {
        // 2019-11-20
        let now = new Date();
        return now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0')
    }
};