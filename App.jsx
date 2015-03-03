/** @jsx React.DOM */

var React = require('react/addons'),
  PictureShow = require('react-picture-show'),
  App;

module.exports = App = React.createClass({

  statics: {
    init: function (id) {
      var container = document.getElementById(id);
      React.render(<App/>, container);
    }
  },

  render: function () {
    return (
      <div>
        hi there
        <PictureShow/>
      </div>
    );
  }

});