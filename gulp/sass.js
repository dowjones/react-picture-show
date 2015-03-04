var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  livereload = require('gulp-livereload');

exports.toCss = sassToCss;
exports.toCssWatch = sassToCssWatch;

function sassToCss() {
  return gulp.src('./example/components/App/App.scss')
    .pipe(sass({
      'includePaths': [
        './src/',
        './example/components'
      ]
    }))
    .on('error', gutil.log.bind(gutil, 'SASS Error'))
    .pipe(gulp.dest('./example/_temp'))
    .pipe(livereload());
}

function sassToCssWatch() {
  livereload.listen();
  sassToCss();
  return gulp.watch('./example/components/**/*.scss', sassToCss);
}
