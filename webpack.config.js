const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'development',
	entry: {
		test: './src/index.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	module: {
		// handle filetypes in rules
		rules: [
			// FILES
			{
				test: /\.(png|jpg)$/,
				type: 'asset/resource',
			},
			// JAVASCRIPT
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			// STYLES!
			{
				test: /\.(s(a|c)ss)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			}
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	devServer: {
		hot: true,
		open: true, // open on start
		static: path.join(__dirname, "/dist"),
		compress: true,
		port: 9000
	},
	devtool: 'inline-source-map',
	plugins: [
		// Plugin for hot module replacement
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'IVF Charts',
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.css'
		})
	],
};
