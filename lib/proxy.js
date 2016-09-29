const assert = require('assert'),
      http = require('http'),
      httpProxy = require('http-proxy'),
      ProxyRules = require('http-proxy-rules'),
      _ = require('lodash'),
      log = require('./logger'),
      config =  require('./central-config');

var proxy = httpProxy.createProxy();

function notListed(res) {
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end({message: 'The request url and path did not match any rule!'});
}

module.exports = function(configKey) {
    var server = null;
    return config.getValue(configKey)
        .then(function(configValue) {
            assert.ok(_.isObject(configValue.routing)
                && _.isString(configValue.default),
                'the target proxy should be informed in the configuration');
            var rules = new ProxyRules({
                rules: configValue.routing,
                default: configValue.default
            });
            server = http.createServer(function(req, res) {
                var target = rules.match(req);
                if (target) {
                    log.debug('routing from %s to %s', req.url, target);
                    return proxy.web(req, res, { target: target });
                }
                notListed(res)
            });
            return server;
        });
};


