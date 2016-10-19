const express = require('express'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      morgan = require("morgan"),
      _ = require('lodash'),
      log = require('./logger');

var app = express();
//typical settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// winston injection
app.use(morgan("combined", {stream: log.stream}));
// trivial handler for root
app.get('/', function (request, response) {
    response.status(200)
        .json({
            message: 'up and running',
            origin: request.headers['x-forwarded-for'] || request.connection.remoteAddress
        })
        .end();
});
// public folder
module.exports= function(publicFolders, routes, path) {
    // attach the public folders
    _.forEach(publicFolders, publicFolder =>app.use(express.static(publicFolder)));
    // attach the routes
    _.forEach(routes,  route => app.use(route.path, require(path + route.lib)));
    return app;
};
