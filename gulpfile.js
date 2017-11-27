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
        'bower_components/moment/min/moment.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/pickadate/lib/picker.js',
        'bower_components/pickadate/lib/picker.date.js',
        'bower_components/marked/lib/marked.js'
    ]).pipe(gulp.dest('./docs/js/'))
    gulp.src([
        'bower_components/pickadate/lib/themes/default.css',
        'bower_components/pickadate/lib/themes/default.date.css'
    ]).pipe(gulp.dest('./docs/css/'))
});

gulp.task('electron', function() {
    gulp.src(['electron/**/*','!./electron/TidyTasks-darwin-x64/**/*'])
    .pipe(gulp.dest('./docs/'))
});

gulp.task('js', function() {
    gulp.src('./src/coffee/*.coffee')
    .pipe(coffeescript({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./docs/js/'));
});

gulp.task('default', function(callback) {
    runSequence('libs','html','css','js','images',callback);
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