let common = require("./lib/webpack.common.js");

module.exports = (env, args) => {
    let d = common(env, args);

    d["mode"] = "production";
    d["watch"] = false;
    d["devServer"] = undefined;

    return d;
};
