const assert     = require('assert'),
      http       = require('http'),
      httpProxy  = require('http-proxy'),
      ProxyRules = require('http-proxy-rules'),
      _          = require('lodash'),
      log        = require('./logger');

let proxy = httpProxy.createProxy();

function notListed(req, res) {
    log.error('request to %s coming from %s cannot be dispatched', req.url, req.socket.remoteAddress);
    res.writeHead(500);
    res.end('The request url and path did not match any rule!');
}

module.exports = {
    build: buildFromConfig
};

function buildFromConfig(config) {
    //noinspection JSUnresolvedVariable
    assert.ok(!_.isUndefined(config)
        && _.isObject(config.routing)
        && _.isInteger(config.port),
        'the proxy config object is incomplete');
    //noinspection JSUnresolvedVariable
    let rules = new ProxyRules({
        rules:   config.routing,
        default: config.default
    });
    return http
        .createServer(function(req, res) {
            let target = rules.match(req);
            if(target) {
                log.debug('routing from %s to %s, requester: %s', req.url, target, get_ip(req));
                return proxy.web(req, res, { target: target });
            }
            notListed(req, res)
        })
        .listen(config.port);
}

function get_ip(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}
