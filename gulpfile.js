var gulp = require('gulp'),
    include = require("gulp-include"),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    // browserSync = require('browser-sync')
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload

// source and distribution folder
var
    source = 'app/',
    dest = 'dist/';

// Bootstrap scss source
var bootstrapSass = {
    in: './node_modules/bootstrap-sass/'
};

// GULP TASKS
gulp.task('fonts', fontsCompile);
gulp.task('sass', ['fonts'], sassCompile);
gulp.task('pug', pugCompile);
gulp.task('js', jsCompile);
gulp.task('images', imagesCompile);
gulp.task('browser-sync', ['sass', 'pug', 'js', 'images'], browserSynOpts);
gulp.task('watch', watch);

gulp.task('default', ['watch', 'browser-sync']);


// SASS
var _sass = {
    in: source + 'index.sass',
    out: dest + 'css/',
    watch: source + '**/*.sass',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

function sassCompile() {
    return gulp.src(_sass.in)
        .pipe(sass(_sass.sassOpts).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(_sass.out))
        .pipe(browserSync.reload({ stream: true }));
}

// PUG
var _pug = {
    in: source + 'index.pug',
    out: dest,
    watch: source + '**/*.pug'
};

function pugCompile() {
    return gulp.src(_pug.in)
        .pipe(pug())
        .pipe(gulp.dest(_pug.out))
        .pipe(browserSync.reload({ stream: true }));
}


// JS
var _js = {
    in: source + 'index.js',
    out: dest + 'js/',
    watch: source + '**/*.js'
};

function jsCompile() {
    return gulp.src(_js.in)
        .pipe(include({
            extensions: 'js',
            includePaths: [
                __dirname + '/node_modules',
                __dirname + '/' + source
            ]
        }))
        .on('error', console.log)
        .pipe(gulp.dest(_js.out))
        .pipe(browserSync.reload({ stream: true }));
}


// Fonts
var fonts = {
    in: [source + 'assets/fonts/**/*.{eot,woff,ttf,svg,otf}', bootstrapSass.in + 'assets/fonts/**/*'],
    out: dest + 'fonts/'
};

function fontsCompile() {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
}

// Images
var _img = {
    in: source + 'assets/img/**/*.{png,gif,jpg}',
    out: dest + 'img/'
};

function imagesCompile() {
    return gulp.src(_img.in)
        .pipe(gulp.dest(_img.out));
}

// browser-sync
function browserSynOpts() {
    return browserSync.init({
        server: {
            baseDir: dest
        },
        notify: false
    });
}

// watching
function watch() {
    gulp.watch(_sass.watch, ['sass']);
    gulp.watch(_pug.watch, ['pug']);
    gulp.watch(_js.watch, ['js']);
    // gulp.watch('./dist/**/*.*').on('change', reload);
}