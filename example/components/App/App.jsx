/** @jsx React.DOM */
/* global window, document */

var React = require('react'),
  HelloWorld = require('../HelloWorld/HelloWorld.jsx'),
  App;

module.exports = App = React.createClass({
  getInitialState: function () {
    return this.props;
  },

  render: function () {
    return (
      <html lang="en">
        <head>
          <title>{this.state.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" type="text/css"
            href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/assets/App.css" />
        </head>

        <body>
          <div className="container">
            <HelloWorld />
          </div>

          <script src="/assets/App.js" type="text/javascript"></script>
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: 'window.renderApp(' + JSON.stringify(this.props) + ');'
          }}>
          </script>
        </body>
      </html>
    );
  }
});

if ('object' === typeof window) {
  window.renderApp = function (props) {
    var appFactory = React.createFactory(App);
    React.render(appFactory(props), document);
  };
}
