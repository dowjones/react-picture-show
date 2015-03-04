var express = require('express'),
  router = module.exports = express.Router();

router.get('/', function (req, res, next) {
  res.end('');
});
