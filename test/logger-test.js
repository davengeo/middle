const util = require('util'),
      path = require('path'),
      mockery = require('mockery'),
      configMock = require ('../lib/central-config-mock');

mockery.enable({
    warnOnReplace: true,
    warnOnUnregistered: false
});


describe("This is a common logger module", function() {

    before(() => {
        mockery.enable();
    });

    after(() => {
        mockery.disable();
    });

    const moduleName = '../lib/logger';

    it("whether file config is wrong should assign default values", function (done) {
        mockery.registerSubstitute('./central-config', './central-config-mock');

        var logger = requireUncached(moduleName)
            .on('ready', function() {
                logger.info('default message transport without central configuration');
                done();
            });
    }, 2000);


    it("whether console config is wrong should assign default values", function (done) {
        mockery.registerSubstitute('./central-config', './central-config-mock');
        configMock.setValue('fileLog', {
            level: 'info',
            filename: './logs/default-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        });
        var logger = requireUncached(moduleName)
            .on('ready', function() {
                logger.info('default message transport without central configuration');
                done();
            });
    }, 2000);

    it(" whether all config is ok should assign its values", function (done) {
        mockery.registerSubstitute('./central-config', './central-config-mock');
        configMock.setValue('fileLog', {
            level: 'info',
            filename: './logs/default-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        });
        configMock.setValue('consoleLog', {
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            humanReadableUnhandledException: true,
            timestamp: true
        });
        var logger = requireUncached(moduleName)
            .on('ready', function() {
                logger.info('default message transport with central configuration');
                done();
            });
    }, 2000);

    it(" should provide a stream function for express/morgan", function (done) {
        var logger = requireUncached(moduleName)
            .on('ready', function() {
                logger.stream.write('default message transport without central configuration');
                done();
            });
    }, 2000);

});

function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}
