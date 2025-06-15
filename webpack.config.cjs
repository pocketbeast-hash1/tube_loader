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
        react: "./src/react/index.tsx"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body",
            scriptLoading: "module"
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve("manifest.json"),
                to: path.resolve("dist")
            }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: [/node_modules/, /styles/],
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
                        ]
                    }
                },
                
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css"]
    }
}