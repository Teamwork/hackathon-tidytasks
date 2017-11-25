var gulp = require('gulp');
var watch = require('gulp-watch');
var coffeescript = require('gulp-coffeescript');
var sass = require('gulp-sass');
var pug  = require('gulp-pug');
var gutil = require('gutil');
runSequence = require('run-sequence').use(gulp)

gulp.task('html', function () {
    return gulp.src('./src/**.pug')
    .pipe(pug())
    .pipe(gulp.dest('./docs/'));
});

gulp.task('css', function () {
    return gulp.src('./src/scss/**/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./docs/images/'));
});

gulp.task('libs', function() {
    gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/knockout/dist/knockout.js',
        'bower_components/moment/min/moment.min.js'
    ]).pipe(gulp.dest('./docs/js/'))
});

gulp.task('js', function() {
    gulp.start('libs');
    gulp.src('./src/coffee/*.coffee')
    .pipe(coffeescript({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./docs/js/'));
});

gulp.task('default', function(callback) {
    runSequence('html','css','js','images',callback);
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
});