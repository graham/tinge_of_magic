const path = require("path");
const fs = require('fs');

const util = require("./util");
const constants = require('./constants');
const PASS = "\x1b[32m";
const REGULAR = "\x1b[0m";

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;

var { Liquid } = require('liquidjs');
var engine = new Liquid();

let template_path = argv.template || 'lib/template_index.html';

console.log('index.html template file: ', PASS, template_path, REGULAR);
let template_payload = fs.readFileSync(template_path);

// This is a simple build key of timestamp, will do something
// better soon.
let build_key = `?` + (argv.key || new Date().getTime());
console.log("static file build key:    ", PASS, build_key, REGULAR);

console.log('');

let config = util.loadDirectory({entry: []}, constants.pagesDirectory, "");

console.log('');

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

    engine.parseAndRender(template_payload, {
        path_to_static,
        path_to_vendor,
        path_to_entry_point_js,
        path_to_index_html,
        build_key,
    }).then( (contents) => {
        console.log(PASS + " WROTE", contents.length, "bytes", path_to_index_html);
        fs.writeFileSync(path_to_index_html, contents, { encoding: 'utf8' });
    });
});

