const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    target: 'web',
    name: 'sonic-app',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      uniqueName: 'sonic-app',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.join(__dirname, '/src'),
      },
    },
    performance: {
      maxAssetSize: 650 * 1024,
      maxEntrypointSize: 650 * 1024,
    },
    output: {
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[name].js',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
      hot: true,
      compress: true,
      historyApiFallback: { disableDotRule: true },
      port: 9000,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      devMiddleware: {
        index: true,
        mimeTypes: { 'text/html': ['phtml'] },
        serverSideRender: true,
        writeToDisk: true,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg/,
          type: 'asset/inline',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        process: 'process/browser',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
      }),
    ],
  };
};
