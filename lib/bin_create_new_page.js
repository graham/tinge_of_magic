const fs = require('fs');
const path = require("path");

const util = require("./util");
const constants = require('./constants');

let config = util.loadDirectory({entry: []}, constants.pagesDirectories, "");

let templates = fs.readdirSync('./lib/page_templates').map( path => path );

const PASS = "\x1b[32m";
const FAIL = "\x1b[31m";
const SKIP = "\x1b[33m";
const REGULAR = "\x1b[0m";

async function main() {
    const inquirer = await import('inquirer');
    let prompt = inquirer.default.createPromptModule();

    let use_template = null;

    await prompt([{
        type: 'rawlist',
        name: 'page_template',
        choices: templates,
    }]).then((answer) => {
        use_template = 'lib/page_templates/' + answer.page_template;
    });

    let currentmodules = Object.keys(config.entry).map( (i) => '/app/' + i + '/' );

    currentmodules.sort();

    let target_directory = null;
    
    await prompt([{
        loop: false,
        type: 'list',
        name: 'location',
        message: 'Where to mount your module?  (if unsure, choose /app/) ',
        choices: ['/app/'].concat(currentmodules),
    }]).then((answer) => {
        target_directory = answer.location;
    });

    let new_module_name = '';
   
    await prompt([{
        type: 'input',
        name: 'module_name',
        message: 'Module directory name, must be url safe (no /, no spaces, no +, etc)',
    }]).then((answer) => {
        new_module_name = answer.module_name;
    });


    if (new_module_name.search(/[\/ \+]/) != -1) {
        console.log(FAIL, "ERROR", "No / space or +: " + new_module_name);
        return;
    }

    let module_root = target_directory.slice(1) + new_module_name;

    let is_valid_path = false;

    fs.mkdirSync(module_root);
    console.log(PASS, "CREATE DIRECTORY", module_root);

    fs.mkdirSync(module_root + '/src');
    console.log(PASS, "CREATE DIRECTORY", module_root + '/src');

    let path_to_main_in_template = use_template + '/src/main.tsx';
    let path_to_module_main = module_root + '/src/main.tsx';

    fs.copyFileSync(
        path_to_main_in_template,
        path_to_module_main);

    console.log(PASS, "CREATE FILE", path_to_main_in_template, path_to_module_main);
    
    console.log(PASS, "All done, use pages:genhtml to generate the required index.html");
}


main();
