const path = require("path");

const util = require("./util");
const constants = require('./constants');

let config = util.loadDirectory({entry: []}, constants.pagesDirectory, "");

console.log("\nWebpack Entry Table:")
console.log(config);
console.log("");
