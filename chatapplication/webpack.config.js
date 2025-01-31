const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3002,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,  // Match .css files
        use: ['style-loader', 'css-loader'],  // Load CSS
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,  // Match image file types
        type: 'asset/resource',  // Handle images as static assets
      },
    ],
  },
  plugins: [
    // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
    new ModuleFederationPlugin({
        name:'chatapp',
        filename:'chatAppEntry.js',
        exposes:{
            './App':'./src/App',
            './styles': './src/index.css', // Expose styles as a module
        },
        shared:{'react':{singleton:true,eager:false},'react-dom':{singleton:true,eager:false}}
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};