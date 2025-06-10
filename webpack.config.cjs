const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    target: "web",
    entry: {
        contentScript: "./src/content/index.ts",
        background: "./src/background/index.ts",
        react: "./src/react/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve("manifest.json"),
                to: path.resolve("dist")
            }]
        }),
    ],
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env",
                        ["@babel/preset-react", { 
                            "runtime": "automatic",
                            "importSource": "@emotion/react" 
                        }],
                        "@babel/preset-typescript"
                    ],
                    plugins: [
                        ["@babel/plugin-transform-runtime"],
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ["@babel/plugin-proposal-class-properties", { "loose": true }]
                    ]
                }
            }
        }]
    },
    resolve: {
        alias: {
            'mobx-react-lite': path.resolve(__dirname, 'node_modules/mobx-react-lite'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            'react': path.resolve(__dirname, 'node_modules/react'),
            'scheduler': path.resolve(__dirname, 'node_modules/scheduler'),
        },
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    }
}