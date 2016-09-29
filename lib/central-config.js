const assert = require('assert'),
      couchbase = require('couchbase'),
      config = require('config'),
      Promise = require('bluebird'),
      _ = require('lodash'),
      pjson = require('../package.json');

var configUrl = process.env.COUCHBASE_CONFIG_BUCKET || 'local';
var cluster = configUrl=='local' ?  null : new couchbase.Cluster(configUrl);
var bucket = cluster==null ? null : cluster.openBucket('config');

var centralConfig = {
    configUrl: configUrl,
    getValue: function(key) {
        if (this.configUrl == 'local') {
            return getFromLocal(key);
        } else {
            return getFromCouchbase(key);
        }
    }
};

function getFromLocal(key) {
    assert.deepEqual(centralConfig.configUrl, 'local');
    return new Promise(function (resolve) {
       var value = config.get(key);
       resolve(value);
    });
}
/*
 * getFromCouchbase(key)
 * Search the config object in couchbase with key = node-proxy-key
 * So a json document with such key should exist in the config bucket.
 */
function getFromCouchbase(key) {
    assert.notDeepEqual(centralConfig.configUrl, 'local');
    return new Promise(function (resolve, reject) {
        bucket.get(_.join([pjson.name, key], '-'), function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result.value);
            }
        });
    });
}

module.exports = centralConfig;
