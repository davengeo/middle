const config = require('./lib/central-config'),
      configMock = require('./lib/central-config-mock'),
      proxy = require('./lib/proxy'),
      logger = require('./lib/logger'),
      app = require('./lib/express-worker'),
      commonResp = require('./lib/common-response');

/*
 *    Facade for the middle-js components.
 *    The initialization should be made once in
  *   the main js of the host application.
 *    Remember: -Simple is better-.
 */
function _init(rootDir) {
    config.init(rootDir);
    return logger
        .init()
        .then(() => {
            return {
                config: config,
                configMock: configMock,
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
    configMock: configMock,
    proxy: proxy,
    logger: logger,
    app: app,
    commonResp: commonResp
};
