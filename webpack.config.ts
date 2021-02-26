// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import type { Configuration } from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import packageInfo from "./package.json";
import main from "./webpack.main.config";
import preload from "./webpack.preload.config";
import renderer from "./webpack.renderer.config";

interface WebpackConfiguration extends Configuration {
  devServer?: WebpackDevServerConfiguration;
}

// Use a single devServer configuration across all our multi-compiler configs
const devServerConfig: WebpackConfiguration = {
  // Use empty entry to avoid webpack default fallback to /src
  entry: {},

  // Output path must be specified here for HtmlWebpackPlugin within render config to work
  output: {
    publicPath: "",
    path: path.resolve(__dirname, ".webpack"),
  },

  devServer: {
    contentBase: path.join(__dirname, ".webpack"),
    writeToDisk: (filePath) => {
      // Electron needs to open the main thread source and preload source from disk
      // avoid writing the hot-update js and json files
      // allow writing package.json at root -> needed for electron to find entrypoint
      return /\.webpack\/(main\/(?!.*hot-update)|package\.json)/.test(filePath);
    },
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // electron-packager needs a package.json file to indicate the entry script
    // We purpose the htmlwebpackplugin to write the json rather than an html file
    new HtmlWebpackPlugin({
      filename: "package.json",
      templateContent: JSON.stringify({
        main: "main/main.js",
        name: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
        productDescription: packageInfo.productDescription,
        author: packageInfo.author,
      }),
    }),
  ],
};

export default [devServerConfig, main, preload, renderer];
