const util       = require('util'),
      expect     = require('chai').expect,
      mockery    = require('mockery'),
      simple     = require('simple-mock'),
      winston    = require('winston');

mockery.enable({
    warnOnReplace:      true,
    warnOnUnregistered: false
});

describe("This is the central logger module again", function() {

    before(function() {

    });

    afterEach(function() {
        simple.restore();
    });

    //noinspection JSCheckFunctionSignatures
    it(" whether all config is legit, it should assign its values", function(done) {
        let logger = requireUncached('../lib/logger');
        let addSpy = simple.spy(() => {
        });

        simple.mock(logger, 'add').callFn(addSpy);

        logger.init().then(() => {
        });

        logger.on('ready', function() {
            expect(addSpy.callCount).to.be.equal(2);
            done();
        });
    });

});

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
