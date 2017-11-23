var gulp = require('gulp');
var watch = require('gulp-watch');
var coffeescript = require('gulp-coffeescript');
var sass = require('gulp-sass');
var gutil = require('gutil');
runSequence = require('run-sequence').use(gulp)


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
    runSequence('css','js',callback);
});

gulp.task('watch', function () {
    watch('./src/**/*.*', function () {
        gulp.start('default');
    });
});