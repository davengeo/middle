const assert = require('assert'),
      couchbase = require('couchbase'),
      config = require('config'),
      Promise = require('bluebird'),
      _ = require('lodash');

var configUrl = process.env.COUCHBASE_CONFIG_BUCKET || 'local';
var cluster = configUrl=='local' ?  null : new couchbase.Cluster(configUrl);
var bucket = cluster==null ? null : cluster.openBucket('config');
var prefix = 'not-set';
var rootDirSaved = null;

var centralConfig = {
    configUrl: configUrl,
    init: configure,
    getRootDir: getRootDir,
    getValue: function(key) {
        if (this.configUrl == 'local') {
            return getFromLocal(key);
        } else {
            return getFromCouchbase(key);
        }
    }
};


function configure(rootDir) {
   prefix = require(rootDir + '/package.json').name;
   rootDirSaved = rootDir;
}

function getRootDir() {
    if (_.isEmpty(rootDirSaved)) {
        throw 'Module not initialized, use config.init before this'
    }
    return rootDirSaved;
}

function getFromLocal(key) {
    assert.deepEqual(configUrl, 'local', 'not local has no sense here');
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
    assert.notDeepEqual(configUrl, 'local', 'local has no sense here');
    assert.notDeepEqual(prefix, 'not-set', 'this library should be configured with a prefix');
    return new Promise(function (resolve, reject) {
        bucket.get(_.join([prefix, key], '-'), function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result.value);
            }
        });
    });
}

module.exports = centralConfig;
