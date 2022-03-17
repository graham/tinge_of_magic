const BACKEND_ADDRESS = "http://127.0.0.1:8000";
const WEBSOCKET_ADDRESS = "http://127.0.0.1:15000";

const path = require("path");

let common = require("./lib/webpack.common.js");

module.exports = (env, args) => {
    let d = common(env, args);
    d["mode"] = "development";
    d["devtool"] = "inline-source-map";
    d["watchOptions"] = {
        ignored: ["test", "node_modules", "scripts", "app/**/.#*"],
    };

    d["devServer"] = {
        host: "127.0.0.1",
        liveReload: true,
        hot: true,

        devMiddleware: {
            index: true,
            publicPath: '/app/static/compiled',
        },

        static: {
            directory: path.join(__dirname, "."),
            serveIndex: true,
            watch: true,
        },

        headers: {
            "X-Content-Type-Options": "nosniff",
        },
        proxy: {
            "/auth/": {
                target: BACKEND_ADDRESS,
            },
            "/api/": {
                target: BACKEND_ADDRESS,
            },
            "/admin/": {
                target: BACKEND_ADDRESS,
            },
            "/static/admin/": {
                target: BACKEND_ADDRESS,
            },
            "/ws/": {
                target: WEBSOCKET_ADDRESS,
                ws: true,
            },
        },
    };

    return d;
};
