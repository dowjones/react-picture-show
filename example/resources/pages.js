var express = require('express'),
  React = require('react'),
  App = React.createFactory(require('../components/App/App.jsx')),
  router = module.exports = express.Router();

router.get('*', function (req, res, next) {
  var props = {};
  res.send('<!DOCTYPE html>' + React.renderToString(App(props)));
});
