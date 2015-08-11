require("babel/register");

var React = require('react'),
  express = require('express'),
  compression = require('compression'),
  disableHttpCache = require('connect-cache-control'),
  morgan = require('morgan'),
  serveStatic = require('serve-static'),
  errors = require('common-errors'),
  PORT = process.env.PORT || 8000,
  IS_PROD = 'production' === process.env.NODE_ENV,
  app = module.exports = express();

// utility middleware
app.use(disableHttpCache);
app.use(morgan(IS_PROD ? 'combined' : 'dev'));
app.use(compression());

app.use('/favicon.ico', function (req, res, next) {
  res.end('');
});

// app resources
app.use('/assets', serveStatic(__dirname + '/_temp'));

var App = React.createFactory(require('./components/App/App.jsx'));
app.use('/', function (req, res, next) {
  var props = {};
  res.send('<!DOCTYPE html>' + React.renderToString(App(props)));
});

app.use(errors.middleware.errorHandler);

if (!module.parent) {
  app.listen(PORT, function () {
    console.log('on :%s', PORT);
  });
}
