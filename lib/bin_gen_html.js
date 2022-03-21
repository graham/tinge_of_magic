const path = require("path");
const fs = require('fs');

const util = require("./util");
const constants = require('./constants');
const PASS = "\x1b[32m";

let config = util.loadDirectory({entry: []}, constants.pagesDirectory, "");

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;

var { Liquid } = require('liquidjs');
var engine = new Liquid();

var template = `
<html>
  <head>
    <link rel="stylesheet" href="{{path_to_static}}/css/main.css{{build_key}}">
    <link rel="stylesheet" href="{{path_to_static}}/css/tailwind_generated.css{{build_key}}">
  </head>
  <body>
    <div id='content'></div>
  </body>
  <script charset="utf-8" src='{{path_to_vendor}}{{build_key}}'> </script>  
  <script charset="utf-8" src='{{path_to_entry_point_js}}{{build_key}}'> </script>
</html>
`.trim();


// This is a simple build key of timestamp, will do something
// better soon.
let build_key = `?` + (argv.key || new Date().getTime());
console.log("BUILD_KEY: ", build_key);


Object.keys(config.entry).forEach( (key) => {
    let main_path = config.entry[key];

    let dir_name = path.dirname(main_path);
    let path_list = dir_name.split('/');
    let depth = path_list.length - 3;

    let path_to_root = [];
    util.range(depth).forEach( () => {
        path_to_root.push('..');
    });
    path_to_root.push('static');

    let path_to_static = path_to_root.join('/');

    path_to_root.push('compiled');

    let path_to_vendor = path_to_root.join('/') + '/vendor.js';

    path_to_root.push(key);

    let path_to_entry_point_js = path_to_root.join('/') + '.js';

    let path_to_index_html = path_list.slice(0, path_list.length-1).join('/') + '/index.html';

    engine.parseAndRender(template, {
        path_to_static,
        path_to_vendor,
        path_to_entry_point_js,
        path_to_index_html,
        build_key,
    }).then( (contents) => {
        console.log(PASS + "WRITTEN", contents.length, "bytes", path_to_index_html);
        fs.writeFileSync(path_to_index_html, contents, { encoding: 'utf8' });
    });
});
