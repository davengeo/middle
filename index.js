const config     = require('./lib/central-config'),
      proxy      = require('./lib/proxy'),
      logger     = require('./lib/logger'),
      app        = require('./lib/express-worker'),
      commonResp = require('./lib/common-response'),
      _exports = {
          init:       _init,
          config:     config,
          proxy:      proxy,
          logger:     logger,
          app:        app,
          commonResp: commonResp
      };

/*
 *   Facade for the middle-js components.
 *   The initialization should be made once in
 *   the main js of the host application or test case.
 *   Remember: -Simple is better-.
 *
 */

function _init(rootDir) {
    config.init(rootDir);
    return logger
        .init()
        .then(() => {
            return _exports;
        })
}

module.exports = _exports;
