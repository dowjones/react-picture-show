// from https://github.com/Khan/react-components/blob/master/test/test-helper.js

// require("./object-assign-polyfill.js");

// React determines if it can depend on the DOM at require-time, so if we don't
// set this up beforehand it will complain about not being able to do things
// with the DOM.
// Perhaps a bug in React?
var jsdom = require("jsdom");

global.document = jsdom.jsdom('<html><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;