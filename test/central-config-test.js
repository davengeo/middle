const util = require('util'),
      path = require('path'),
      expect = require('chai').expect;

describe("A central configuration module", function() {

    const moduleName = '../lib/central-config';
    const mockModuleName = '../lib/central-config-mock';

    it("it should be an environment variable with the config server url", function() {
        process.env.COUCHBASE_CONFIG_BUCKET = 1;
        var centralConfig = requireUncached(moduleName);
        expect(centralConfig.configUrl).not.to.be.an('undefined');
        expect(centralConfig.configUrl).to.be.equal('1');
    });

    it("whether the environment variable is undefined the configuration should be local", function() {
        delete process.env.COUCHBASE_CONFIG_BUCKET;
        var centralConfig = requireUncached(moduleName);
        expect(centralConfig.configUrl).to.be.equal('local');
    });

    it("whether local configuration it should be loaded from json files", function(done) {
        delete process.env.COUCHBASE_CONFIG_BUCKET;
        var centralConfig = requireUncached(moduleName);
        expect(centralConfig.configUrl).to.be.equal('local');

        expect(centralConfig.getValue('fileLog')).not.to.be.equals('undefined');

        centralConfig.getValue('fileLog').then(value => {
            expect(value.level).to.be.equal('debug');
            done();
        }, 2000);
    });

    it("whether central configuration it should be loaded from couchBase", function(done) {
        process.env.COUCHBASE_CONFIG_BUCKET = 'couchbase://el3772.bc/';
        var centralConfig = requireUncached(moduleName);
        centralConfig.init(path.resolve(__dirname, '..'));
        expect(centralConfig.configUrl).to.be.equal('couchbase://el3772.bc/');

        expect(centralConfig.getValue('fileLog')).not.to.be.equal('undefined');

        centralConfig.getValue('fileLog')
            .then(function(value) {
                expect(value.level).to.be.equal('info');
                done();
            });

    }, 4000);

    it("whether central configuration but key is not in couchBase it should throw an error", function(done) {
        process.env.COUCHBASE_CONFIG_BUCKET = 'couchbase://el3772.bc/';
        var centralConfig = requireUncached(moduleName);
        centralConfig.init(path.resolve(__dirname, '..'));

        expect(centralConfig.configUrl).to.be.equal('couchbase://el3772.bc/');
        centralConfig.getValue('NotInCouchBase')
            .then(function() {
                fail('this key is not in couchbase');
            })
            .catch(function(err) {
                expect(err.message).to.be.equal('The key does not exist on the server');
                expect(err.code).to.be.equal(13);
                done();
            });
    }, 2000);

    it("whether local configuration but key is not in folder it should throw an error", function(done) {
        delete process.env.COUCHBASE_CONFIG_BUCKET;
        var centralConfig = requireUncached(moduleName);
        expect(centralConfig.configUrl).to.be.equal('local');
        var badKey = 'NotInLocal';
        centralConfig.getValue(badKey)
            .then(function() {
                fail('this key is not in couchbase');
            })
            .catch(function(err) {
                expect(err.message).to.be.equal(util.format('Configuration property "%s" is not defined', badKey));
                done();
            });
    }, 2000);

    it("whether module has configured it should keep the root directory", function() {
        var centralConfig = requireUncached(moduleName);
        centralConfig.init(path.resolve(__dirname, '..'));
        expect(centralConfig.getRootDir()).to.be.equal(path.resolve(__dirname, '..'));
    });

    it("whether module not configured it should throw error when asked for root directory", function() {
        var centralConfig = requireUncached(moduleName);
        try {
            centralConfig.getRootDir();
            fail()
        } catch (err) {
            expect(err).to.be.equal('Module not initialized, use config.init before this');
        }
    });

    it("whether mock module has configured it should keep the root directory", function() {
        var centralConfig = requireUncached(mockModuleName);
        centralConfig.init(path.resolve(__dirname, '..'));
        expect(centralConfig.getRootDir()).to.be.equal(path.resolve(__dirname, '..'));
    });

    it("whether mock module not configured it should throw error when asked for root directory", function() {
        var centralConfig = requireUncached(mockModuleName);
        try {
            centralConfig.getRootDir();
            fail()
        } catch (err) {
            expect(err).to.be.equal('Module not initialized, use config.init before this');
        }
    });

    it("whether mock module has configured a default value it always respond with it", function() {
        var centralConfig = requireUncached(mockModuleName);
        centralConfig.setDefault('test-value');
        expect(centralConfig.getValue('hazard')).to.be.equal('test-value');
    });

    it("whether mock module has configured a value it should respond with it", function() {
        var centralConfig = requireUncached(mockModuleName);
        centralConfig.setValue('hazard', 'test-new-value');
        expect(centralConfig.getValue('hazard')).to.be.equal('test-new-value');
    });

});

function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}
