module.exports = {
    log: function(message) {
        console.log(new Date().toUTCString() + " ::: " + message);
    }
};