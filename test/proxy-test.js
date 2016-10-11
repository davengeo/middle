const express = require('express'),
      request = require('supertest'),
      config = require('../lib/central-config'),
      expect = require('chai').expect;

var app = express();
var appTarget = express();
var serverApp, serverTarget;

describe("A module to proxy the some configurable target", function() {

    const MODULE_NAME = '../lib/proxy';

    beforeEach(function () {
        serverApp    = app.listen(3000);
        serverTarget = appTarget.listen(3001);
    });

    afterEach(function () {
        serverApp.close();
        serverTarget.close();
    });

    it("whether used in express should proxy get requests to conf.target", function (done) {
        var resultInProxy = {name: 'tobi'};
        appTarget.get('/user', function (req, res) {
            res.status(200).json(resultInProxy);
        });

        config.getValue('config-1').then(config => {
            var proxy = requireUncached(MODULE_NAME).build(config);

            request(proxy)
                .get('/test1/user')
                .expect(200, resultInProxy)
                .end(function (err) {
                    proxy.close();
                    if (err) throw err;
                    done();
                });
        });
    }, 2000);


    it("whether used in express should proxy post requests to conf.default", function (done) {
        var resultInProxy = {name: 'tobi'};
        appTarget.post('/user', function (req, res) {
            res.status(201).json(resultInProxy);
        });

        config.getValue('config-1').then(config => {
            var proxy = requireUncached(MODULE_NAME).build(config);

            request(proxy)
                .post('/test1/user')
                .expect(201, resultInProxy)
                .end(function (err) {
                    proxy.close();
                    if (err) throw err;
                    done();
                });
        });
    }, 2000);

    it("whether config is wrong should fail", function (done) {
        config
            .getValue('config-err')
            .then(config => {
                try {
                    var proxy = requireUncached(MODULE_NAME).build(config);
                    fail('should throw error');
                } catch(err) {
                    expect(err.message).to.be.equal('the proxy config object is incomplete');
                    done();
                }
            });
    }, 2000);

});


function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}
