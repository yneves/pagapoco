/**
 * Loading and updating files stuffs
 */
var source = require('vinyl-source-stream'),
    gulp = require('gulp'),
    browserify = require('browserify'),
    rimraf = require('rimraf'),
    runSequence = require('run-sequence'),
    reactify = require('reactify'),
    gconnect = require('gulp-connect'),
    // server = require('gulp-express'),
    gutil = require('gulp-util');
    less = require('gulp-less');

// TODO implementar watchify porque valida as diferenças de forma mais inteligente nos arquivos
var watchify = require('watchify');
var notify = require("gulp-notify");

// Define some paths
var paths = {
    html : ['./src/index.html'],
    assets : ['./src/assets/*', './src/assets/**/*'],
    js : ['./src/js/*', './src/js/**/*'],
    styles : ['./src/styles/*', './src/styles/**/*']
};

/**
 * Clear all the files!
 */
gulp.task('clean', function (cb) {
    gutil.log('Cleaning dist files');
    rimraf('./dist', cb);
});

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
/**
 * Concatenate all the js! (run the requires and stuff)
 */
gulp.task('js', function () {
    browserify("./client.js")
        .transform(reactify)
        .bundle()
        .pipe(source('client.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(gconnect.reload());
});

/**
 * Copy all (only) index.html
 */
gulp.task('html', function () {
    gulp.src(paths.html)
        .pipe(gulp.dest('dist'))
        .pipe(gconnect.reload());

});

// specific function to get flex grid css to dist
gulp.task('flexboxgrid', function () {
    gulp.src('node_modules/flexboxgrid/dist/flexboxgrid.min.css')
        .pipe(gulp.dest('./dist/styles'));
});

function handleError(err) {
    console.log(err.toString());
}

gulp.task('styles', function () {
    gulp.src('src/styles/app.less')
        .pipe(less().on('error', handleError))
        .pipe(gulp.dest('./dist/styles'));
});

/**
* Export all the assets!
*/
gulp.task('assets', function () {
    gulp.src(paths.assets)
        .pipe(gulp.dest('dist/assets'))
        .pipe(gconnect.reload());
});

/**
* Export all json resources
*/
gulp.task('resources', function () {
    gulp.src('src/resources/*')
        .pipe(gulp.dest('dist/resources'))
        .pipe(gconnect.reload());
});

// specific function to get flex grid css to dist
gulp.task('flexboxgrid', function () {
    gulp.src('node_modules/flexboxgrid/dist/flexboxgrid.min.css')
        .pipe(gulp.dest('./dist/styles'));
});

//Webserver for dev
gulp.task('server', function () {

    // TODO deve rodar o codigo que esta salvo em server.js
    // server.run({
    //     file: 'server.js'
    // });

    gconnect.server({
       root: "dist",
       fallback: "dist/index.html",
       livereload: true
    });

    gutil.log('Watching html, styles, assets and js');
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.assets, ['assets']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('watch', function (callback) {
    gutil.log('Watching html, styles, assets and js');
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.assets, ['assets']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'server',
        ['html', 'assets', 'resources', 'js', 'styles', 'flexboxgrid'],
        callback
    );
});

gulp.task('default', ['build']);
