const util = require('util'),
      pjson = require('../package.json'),
      _ = require('lodash'),
      os = require('os');

function getPublicAddress() {
    let interfaces = os.networkInterfaces();
    //noinspection JSUnresolvedFunction
    return _.chain(interfaces)
        .filter(function(o) {
            return o[0].family == 'IPv4' && !_.startsWith(o[0].address, '192.168');
        })
        .flatten()
        .first()
        .value()
        .address;
}

var info = {
    serviceName: pjson.name,
    address: getPublicAddress()
};

module.exports = {
    info: info,
    getAddress: getPublicAddress
};
