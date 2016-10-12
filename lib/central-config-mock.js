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

function getRootDir() {
    return rootDir;
}

function configure(newRootDir) {
    rootDir = newRootDir;
}

module.exports = {
    configUrl: configUrl,
    config: configure,
    rootDir: getRootDir,
    getValue: function(key) {
        return values[key];
    },
    setValue: setValue,
    setDefault: setDefaultValue
};

