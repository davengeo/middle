const util = require('util'),
      path = require('path'),
      expect = require('chai').expect;

describe("A central configuration module", function() {

    const moduleName = '../lib/central-config';

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
        process.env.COUCHBASE_CONFIG_BUCKET = 'couchbase://el3771.bc/';
        var centralConfig = requireUncached(moduleName);
        centralConfig.config(path.resolve(__dirname, '..'));
        expect(centralConfig.configUrl).to.be.equal('couchbase://el3771.bc/');

        expect(centralConfig.getValue('fileLog')).not.to.be.equal('undefined');

        centralConfig.getValue('fileLog')
            .then(function(value) {
                expect(value.level).to.be.equal('info');
                done();
            });

    }, 4000);

    it("whether central configuration but key is not in couchBase it should throw an error", function(done) {
        process.env.COUCHBASE_CONFIG_BUCKET = 'couchbase://el3771.bc/';
        var centralConfig = requireUncached(moduleName);
        centralConfig.config(path.resolve(__dirname, '..'));

        expect(centralConfig.configUrl).to.be.equal('couchbase://el3771.bc/');
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

    it("whether module is configured it should return root folder", function() {
        delete process.env.COUCHBASE_CONFIG_BUCKET;
        var centralConfig = requireUncached(moduleName);
        let mainDir = path.resolve(__dirname, '..');
        centralConfig.config(mainDir);
        expect(centralConfig.rootDir()).to.be.equal(mainDir);
    });

    it("whether module has not been configured and get root directory it should throw error", function() {
        delete process.env.COUCHBASE_CONFIG_BUCKET;
        var centralConfig = requireUncached(moduleName);
        try {
            centralConfig.rootDir();
            fail('cannot reach this');
        } catch (err) {
            expect(err.message).to.be.equal('Root directory configuration pending');
        }
    });
});

function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}
