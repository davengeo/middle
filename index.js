const config = require('./lib/central-config'),
      proxy = require('./lib/proxy'),
      logger = require('./lib/logger'),
      app = require('./lib/express-worker'),
      commonResp = require('./lib/common-response');

/*
 *    Facade for the middle-js components.
 *    Simple is better.
 */
module.exports = {
    config: config,
    proxy: proxy,
    logger: logger,
    app: app,
    commonResp: commonResp
};
