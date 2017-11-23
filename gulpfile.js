var gulp = require('gulp');
var pug = require('gulp-pug');
var coffeescript = require('gulp-coffeescript');
var sass = require('gulp-sass');
var gutil = require('gutil');
runSequence = require('run-sequence').use(gulp)

gulp.task('html', function buildHTML() {
  return gulp.src('./src/*.pug')
  .pipe(pug({verbose:false})).pipe(gulp.dest('./docs/'))
});

gulp.task('css', function () {
    return gulp.src('./src/scss/**/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./docs/css/'));
});

gulp.task('js', function() {
    gulp.src('./src/coffee/*.coffee')
   .pipe(coffeescript({bare: true}).on('error', gutil.log))
   .pipe(gulp.dest('./docs/js/'));
});

gulp.task('default', function(callback) {
    runSequence('html','css','js',callback);
});