const pagesDirName = "app";

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const fs = require('fs');

let app_dirs = ['app/'];

if (fs.existsSync('tinge.json')) {
    let config_txt = fs.readFileSync('./tinge.json');
    const config = JSON.parse(config_txt);
    app_dirs = config.app_dirs || ['app'];
}

console.log("Application directories: " + JSON.stringify(app_dirs));

const pagesDirectories = app_dirs;

module.exports = {
    pagesDirName,
    pagesDirectories,
};
