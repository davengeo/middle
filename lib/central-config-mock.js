const _ = require('lodash');

let values = {};
let rootDirSaved = null;
let configUrl = '';
let defaultValue = null;

function setValue(key, value) {
    values[key] = value;
}

function setDefaultValue(value) {
    defaultValue = value;
}

function configure(newRootDir) {
    rootDirSaved = newRootDir;
}

function getRootDir() {
    if (_.isEmpty(rootDirSaved)) {
        throw 'Module not initialized, use config.init before this'
    }
    return rootDirSaved;
}

module.exports = {
    configUrl: configUrl,
    init: configure,
    getRootDir: getRootDir,
    getValue: function(key) {
        if (defaultValue == null) {
            return values[key];
        } else {
            return defaultValue;
        }
    },
    setValue: setValue,
    setDefault: setDefaultValue
};

