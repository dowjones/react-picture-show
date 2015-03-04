var rimraf = require('rimraf');

exports.clean = clean;

function clean(cb) {
  return rimraf('./example/_temp', cb);
}
