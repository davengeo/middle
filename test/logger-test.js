const util       = require('util'),
      path       = require('path'),
      expect     = require('chai').expect,
      mockery    = require('mockery'),
      simple     = require('simple-mock'),
      winston    = require('winston'),
      configMock = require('../lib/central-config').mock;


mockery.enable({
    warnOnReplace:      true,
    warnOnUnregistered: false
});

describe("This is the central logger module", function() {

    before(function() {
        mockery.registerSubstitute('./central-config', './central-config-mock');
    });

    afterEach(function() {
        simple.restore();
    });

    after(function() {
        mockery.disable();
    });

    const moduleName = '../lib/logger';

    //noinspection JSCheckFunctionSignatures
    it("whether file config is wrong should assign default values", function(done) {
        var logger = requireUncached(moduleName);
        logger.init();
        logger
            .on('ready', function() {
                logger.info('default message transport without central configuration');
                done();
            });
    });

    //noinspection JSCheckFunctionSignatures
    it("whether console config is wrong should assign default values", function(done) {
        configMock.setValue('fileLog', {
            level:            'info',
            filename:         './logs/default-logs.log',
            handleExceptions: true,
            json:             true,
            maxsize:          5242880, //5MB
            maxFiles:         5,
            colorize:         false
        });
        var logger = requireUncached(moduleName);
        logger.init();
        logger
            .on('ready', function() {
                logger.info('default message transport without central configuration');
                done();
            });
    });

    //noinspection JSCheckFunctionSignatures
    it(" should provide a stream function for express/morgan", function(done) {
        var logger = requireUncached(moduleName);
        logger.init();
        logger
            .on('ready', function() {
                //noinspection JSUnresolvedFunction
                logger.stream.write('default message transport without central configuration');
                done();
            });
    });

});

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
