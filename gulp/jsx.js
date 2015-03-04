var gulp = require('gulp'),
  gutil = require('gulp-util'),
  buffer = require('gulp-buffer'),
  source = require('vinyl-source-stream'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify');

exports.toJs = function () {
  return createStream(createBundler(false))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./example/_temp'));
};

exports.toJsWatch = function () {
  var bundler = createBundler(true);

  function createBundlerStream() {
    return createStream(bundler)
      .pipe(gulp.dest('./example/_temp'));
  }

  bundler = watchify(bundler);
  bundler.on('update', createBundlerStream);
  bundler.on('time', function (time) {
    console.log('App.js built in: %dms', time);
  });

  return createBundlerStream();
};

function createBundler(isDebug) {
  return browserify('./example/components/App/App.jsx', {
    cache: {},
    packageCache: {},
    fullPaths: true,
    transform: ['reactify'],
    debug: isDebug
  });
}

function createStream(bundler) {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('App.js'));
}
