var gulp = require('gulp');
var runSequence = require('run-sequence');
var webpack = require("webpack");
var del = require('del');
var path = require('path');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssgrace = require('cssgrace');
var cssver = require('gulp-make-css-url-version');
var cleanCSS = require('gulp-clean-css');
var watch = require('gulp-watch');
var gutil = require("gulp-util");

var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

gulp.task('less', function(){
    var processors = [
        autoprefixer({browsers: ['last 2 version', 'ie 6-11']}),
        cssgrace
    ];

    return gulp.src('./static/css/src/**/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./static/css/dist'));
});

gulp.task('css', ['less'], function(){
    return gulp.src('./static/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(cssver())
        .pipe(gulp.dest('./static/dist/css'));
});

/*.pipe(gulpif(!debug, uglify()))
        .pipe(gulp.dest('dist'))*/

gulp.task('clean', function(cb) {
    return del(['./static/dist'], cb);
});

gulp.task('image', function(cb) {
	return gulp.src(['./static/images/**/*'])
    	.pipe(gulp.dest('./static/dist/images'));
});

gulp.task("webpack", function(cb) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        cb();
    });
});

gulp.task("webpack-dev-server", function(callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;
    // Start a webpack-dev-server
    var compiler = webpack(myConfig);

    new WebpackDevServer(compiler, {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        //port: 9090,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server");

        // keep the server alive or continue?
        // callback();
    });
});

gulp.task('watch', function() {
    gulp.watch(['./static/css/src/**/*.less', './static/css/*.css'], ['css']);
    gulp.watch('./static/images/**/*', ['image']);
});

gulp.task('default', ['clean'], function(cb) {
    runSequence(['css', 'image', 'webpack-dev-server'], 'watch', cb);
});
