module.exports = {
    fullTimestamp: function() {
        // 11/20/2019, 10:19:09 PM CST
        return new Date().toLocaleString( 'sv', { timeZoneName: 'short' } );
    },
    dateOnlyTimestamp: function() {
        // 2019-11-20
        let now = new Date();
        return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    }
};