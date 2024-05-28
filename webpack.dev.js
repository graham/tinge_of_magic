const BACKEND_ADDRESS = "http://127.0.0.1:8000";
//const WEBSOCKET_ADDRESS = "http://127.0.0.1:15000";

const path = require("path");
let common = require("./lib/webpack.common.js");

let public_prefix = '';

module.exports = (env, args) => {
    let d = common(env, args);

    d["mode"] = "development";
    d["devtool"] = "inline-source-map";
    d["watchOptions"] = {
        ignored: ["test", "node_modules", "scripts", "app/**/.#*", "app/static/compiled/"],
    };

    d["devServer"] = {
        host: "127.0.0.1",
        port: 9000,

        liveReload: true,
        hot: true,

        devMiddleware: {
            index: true,
            publicPath: public_prefix  + '/app/static/compiled',
        },

        static: {
            directory: path.join(__dirname, "."),
            publicPath: public_prefix,
            serveIndex: true,
            watch: true,
        },

        headers: {
            "X-Content-Type-Options": "nosniff",
        },

        proxy: [
            { context: ["/auth/"], target: BACKEND_ADDRESS },
            { context: ["/api/"], target: BACKEND_ADDRESS },
            { context: ["/admin/"], target: BACKEND_ADDRESS },
            { context: ["/static/admin/"], target: BACKEND_ADDRESS },
            //{ context: ["/ws/"], target: BACKEND_ADDRESS, ws: true },
        ]
    };

    return d;
};
