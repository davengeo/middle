const assert = require('assert'),
      http = require('http'),
      httpProxy = require('http-proxy'),
      ProxyRules = require('http-proxy-rules'),
      _ = require('lodash'),
      log = require('./logger');

var proxy = httpProxy.createProxy();

function notListed(req, res) {
    log.error('request to %s coming from %s cannot be dispatched', req.baseUrl, req.ip);
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end({message: 'The request url and path did not match any rule!'});
}

module.exports = {
    configure: configure
};


function configure(config) {
    var server = null;
    assert.ok(  _.isObject(config.routing)
        && _.isString(config.default),
        'the target proxy should be in the config object');
    var rules = new ProxyRules({
        rules: config.routing,
        default: config.default
    });
    return http.createServer(function(req, res) {
        var target = rules.match(req);
        if (target) {
            log.debug('routing from %s to %s', req.url, target);
            return proxy.web(req, res, { target: target });
        }
        notListed(req, res)
    });
}


