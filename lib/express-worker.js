const cluster = require('cluster'),
      express = require('express'),
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
            origin: request.ip
        })
        .end();
});
// public folder
module.exports= function(publicFolders) {
    _.forEach(publicFolders, publicFolder =>
        app.use(express.static(publicFolder)));
    return app;
};
