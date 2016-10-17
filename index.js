const config = require('./lib/central-config'),
      proxy = require('./lib/proxy'),
      logger = require('./lib/logger'),
      app = require('./lib/express-worker'),
      commonResp = require('./lib/common-response');

/*
 *    Facade for the middle-js components.
 *    The initialization should be made once in the main js.
 *    Simple is better.
 */
function _init(rootDir) {
    config.init(rootDir);
    return logger
        .init()
        .then(() => {
            return {
                config: config,
                proxy: proxy,
                logger: logger,
                app: app,
                commonResp: commonResp
            }
        })
}

module.exports = {
    init: _init,
    config: config,
    proxy: proxy,
    logger: logger,
    app: app,
    commonResp: commonResp
};
