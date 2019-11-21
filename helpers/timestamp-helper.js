module.exports = {
    timestamp: function() {
        return new Date().toLocaleString( 'sv', { timeZoneName: 'short' } ).split(",")[0].replace(/\//g, '-');
    }
};