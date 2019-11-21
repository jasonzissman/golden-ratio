const fs = require('fs').promises;
const ts = require("./timestamp-helper");

let logFilePromiseChain = Promise.resolve();
const filename = "log.txt";

module.exports = {
    log: function(message) {
        let messageWithDate = ts.fullTimestamp() + " ::: " + message;
        console.log(messageWithDate);
        logFilePromiseChain = logFilePromiseChain.then(fs.appendFile(filename, messageWithDate + "\r\n"));
    }
};