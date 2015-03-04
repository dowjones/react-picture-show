var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');

exports.start = start;

function start() {
  var config = {
    script: 'example/server.js',
    watch: ['example/**/*.js', 'src/**/*.js']
  };
  return nodemon(config);
}
