const centralConfig = require('./lib/central-config'),
      proxy = require('./lib/proxy'),
      logger = require('./lib/logger'),
      app = require('./lib/express-worker');


module.exports = {
    centralConfig: centralConfig,
    proxy: proxy,
    logger: logger,
    app: app
};
