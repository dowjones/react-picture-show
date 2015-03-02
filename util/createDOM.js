
var jsdom = require('jsdom');

module.exports = function createDOM () {
  global.document = jsdom.jsdom('<html><body></body></html>');
  global.window = document.parentWindow;
  global.navigator = window.navigator;
};