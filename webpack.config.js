var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

function entries(globPath) {
    var files = glob.sync(globPath);
    var entries = {}, entry, dirname, basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        basename = path.basename(entry, '.js');
        entries[path.join(dirname, basename).replace('static\\', '')] = entry;
    }
    console.log(__dirname);
    return entries;
}

module.exports = {
    //页面入口文件配置
    // entry: {
    //     index : './public/js/index.js',
    //     error: './public/js/error.js'
    // },
    entry: entries('{./static/js/!(utils|widgets|tmpl)/*.js,./static/js/*.js}'),
    //入口文件输出配置
    output: {
        path: path.join(__dirname, '/static/dist/'),
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/,
                exclude: /(node_modules|bower_components)/, loader: 'babel-loader',
              query: {
                presets: ['es2015', 'stage-0']
              } 
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    resolve: {
        root: ['node_modules', 'bower_components'],
        alias: {
            //jquery: path.join(__dirname, "./src/lib/jquery/dist/jquery.min.js")
        }   
    },
    //插件项
    plugins: [
        //commonsPlugin, 
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("[name].css"),
        new BowerWebpackPlugin({
            excludes: /.*\.less/
        }),
        new webpack.ProvidePlugin({
            '_': 'lodash',
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    ],
    watch: true
};