var values = {};
var rootDir = __dirname;
var configUrl = '';
var defaultValue = null;

function setValue(key, value) {
    values[key] = value;
}

function setDefaultValue(value) {
    defaultValue = value;
}

function configure(newRootDir) {
    rootDir = newRootDir;
}

module.exports = {
    configUrl: configUrl,
    init: configure,
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

