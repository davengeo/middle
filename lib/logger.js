const assert = require('assert');
var winston = require('winston');
var Promise = require('bluebird');
var config =  require('./central-config');

winston.emitErrs = true;

var fileLogDefault = {
    level: 'info',
    filename: './logs/default-logs.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
};

var consoleLogDefault = {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    humanReadableUnhandledException: true,
    timestamp: true
};

var logger = new winston.Logger();

Promise
    .all([config.getValue('fileLog'), config.getValue('consoleLog')])
    .then(function(results){
        assert.equal(results.length, 2, "both promises should be fulfilled here");
        logger.add(winston.transports.File, results[0]);
        logger.add(winston.transports.Console, results[1]);
    })
    .catch(function(err) {
        logger.add(winston.transports.File, fileLogDefault);
        logger.add(winston.transports.Console, consoleLogDefault);
        logger.log('error', err);
    })
    .finally(function() {
        logger.exitOnError = false;
        logger.emit('ready');
    });

logger.stream = {
    write: function(message){
        logger.info(message);
    }
};

module.exports =  logger;


