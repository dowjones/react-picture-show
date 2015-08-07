/* global window, document */

var React = require('react'),
  SimpleSlideshow = require('../SimpleSlideshow/SimpleSlideshow.jsx'),
  ImageSlideshow = require('../ImageSlideshow/ImageSlideshow.jsx'),
  App;

module.exports = App = React.createClass({
  render: function () {
    return (
      <html lang="en">
        <head>
          <title>{this.props.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" type="text/css" href="/assets/App.css" />
        </head>

        <body>

          <div className="main-well">
            <div className="example">
              <SimpleSlideshow/>
            </div>
            <div className="example">
              <ImageSlideshow/>
            </div>
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
