const fs = require("fs");

const PASS = "\x1b[32m";
const FAIL = "\x1b[31m";
const SKIP = "\x1b[33m";
const REGULAR = "\x1b[0m";

function loadDirectory(config_dict, dir, prefix) {
    var files;

    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        console.log(
            "webpack_config_test doesnt have access to the file data so we need a default"
        );
        files = [];
    }

    files.forEach(function (file) {
        if (
            (fs.lstatSync(dir + file).isDirectory() ||
             fs.lstatSync(dir + file).isSymbolicLink()) &&
                file != "static" &&
                file != "lib" &&
                file != "src" &&
                file[0] != "." &&
                file[0] != "_"
        ) {
            const main_path = dir + "/" + file + "/src/main.tsx";
            let entry_name = prefix.length > 0 ? prefix + "/" + file : file;
            // if the key is already in the entry dict we can assume this is
            // manual and we shouldn't auto-handle. (but we will warn.)
            if (config_dict.entry[entry_name] !== undefined) {
                console.log('\t', PASS, 'SKIP', REGULAR, 'Skipping ' + file + ' because of custom entry.');
                return;
            }

            // We've found a directory that we think we want to add, lets
            // make sure that it has a lib/main.ts/.tsx file, if not, warn the user.
            if (fs.existsSync(main_path) == false) {
                console.log(
                    "\t",
                    SKIP,
                    "SKIP",
                    REGULAR,
                    "Skipping " +
                        file +
                        " because " +
                        file +
                        "/src/main.tsx was not found."
                );
            } else {
                console.log("\t", PASS, "PASS", REGULAR, "Adding " + entry_name);
                config_dict.entry[entry_name] = dir + file + "/src/main.tsx";
            }

            try {
                let subfiles = fs.readdirSync(dir + file);
                subfiles.forEach(function (subfile) {
                    subfile = "/" + subfile;
                    if (subfile == "/src") {
                        return;
                    }
                    if (
                        fs.lstatSync(dir + file + subfile).isDirectory() ||
                        fs.lstatSync(dir + file + subfile).isSymbolicLink()
                    ) {
                        loadDirectory(
                            config_dict,
                            dir + file + "/",
                            entry_name
                        );
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

    return config_dict;
}

const range = (i) => {
    return Array(i)
        .fill(0)
        .map((_, i) => i);
};


module.exports = { loadDirectory, range };
