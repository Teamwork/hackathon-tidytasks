var gulp = require('gulp');
var watch = require('gulp-watch');
var coffeescript = require('gulp-coffeescript');
var sass = require('gulp-sass');
var pug  = require('gulp-pug');
var gutil = require('gutil');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');
var runSequence = require('run-sequence').use(gulp)

gulp.task('html', function () {
    return gulp.src('./src/**.pug')
    .pipe(pug())
    .pipe(gulp.dest('./docs/'));
});

gulp.task('css', function () {
    return gulp.src('./src/scss/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(uncss({
        html: ['./docs/index.html'],
        ignore: [
            /.svg-icon-white/,
            /.loading/,
            /.completed/,
            /.selected/,
            /.late/,
            /.today/,
            /.upcoming/,
            /.highlight/,
            /.navbar-dark/,
            /.visible/
        ]
    }))
    .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./docs/images/'));
});

gulp.task('libs', function() {
    return gulp.src([
        'bower_components/zepto/zepto.min.js',
        'bower_components/knockout/dist/knockout.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/marked/lib/marked.js',
        'bower_components/HackTimer/HackTimer.min.js',
    ])
    .pipe(minify({
        ext: {
            src:'.js',
            min:'.min.js'
        },
        ignoreFiles: ['*.min.js']
    }))
    .pipe(gulp.dest('./docs/js/'))
});

gulp.task('electron', function() {
    return gulp.src(['electron/**/*','!./electron/TidyTasks-darwin-x64/**/*'])
    .pipe(gulp.dest('./docs/'))
});

gulp.task('js', function() {
    return gulp.src('./src/coffee/*.coffee')
    .pipe(coffeescript({bare: true}).on('error', gutil.log))
    .pipe(minify({
        ext: {
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('./docs/js/'));
});

gulp.task('default', function(callback) {
    return runSequence('libs','electron','css','js','images','html',callback);
});

gulp.task('watch', function () {
    watch('./src/coffee/**/*.coffee', function () {
        gulp.start('js');
    });
    watch('./src/scss/**/*.scss', function () {
        gulp.start('css');
    });
    watch('./src/**/*.pug', function () {
        gulp.start('html');
    });
    return
});