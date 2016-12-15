const express      = require('express'),
      path         = require('path'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      morgan       = require("morgan"),
      _            = require('lodash'),
      log          = require('./logger'),
      config       = require('./central-config');

let app = express();
//typical settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// winston injection
app.use(morgan("combined", { stream: log.stream }));

// trivial handler for root
app.get('/', function(request, response) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    response
        .status(200)
        .json({
            message: 'up and running',
            origin:  request.headers['x-forwarded-for'] || request.connection.remoteAddress
        })
        .end();
});

// public folder + configured routes
module.exports = function(publicFolders, routes) {

    // attach the public folders
    //noinspection JSValidateTypes
    _.forEach(publicFolders, publicFolder =>
        app.use(express.static(publicFolder)));
    // attach the routes
    //noinspection JSUnresolvedVariable
    _.forEach(routes, route =>
        app.use(route.path, require(path.resolve(config.getRootDir(), route.lib))));

    return app;
};
