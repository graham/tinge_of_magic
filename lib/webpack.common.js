const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const webpack = require("webpack");
const path = require("path");

const util = require("./util");

const constants = require('./constants');

module.exports = (env, args) => {
    var config_dict = {
        mode: "development",

        entry: {},

        output: {
            path: __dirname + "/../app/static/compiled",
            filename: "[name].js",
        },

        plugins: [
            new webpack.ProvidePlugin({
                TextDecoder: ["text-encoding", "TextDecoder"],
                TextEncoder: ["text-encoding", "TextEncoder"],
            }),
        ],

        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                Root: path.resolve(__dirname, "app/"),
                //GLM: path.resolve("app/modules/"),
            },
            symlinks: true,
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all",
                    },
                },
            },
        },

        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    type: "webassembly/sync",
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: { transpileOnly: false },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                },
            ],
        },

        experiments: {
            syncWebAssembly: true,
            topLevelAwait: true,
        },
    };

    config_dict = util.loadDirectory(config_dict, constants.pagesDirectories, "");

    return config_dict;
};
