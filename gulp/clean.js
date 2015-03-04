var rimraf = require('rimraf');

exports.clean = clean;

function clean(cb) {
  return rimraf('./dist', cb);
}
