/** @jsx React.DOM */

var React = require('react'),
  HelloWorld;

module.exports = HelloWorld = React.createClass({
  render: function () {
    return (
      <div className="HelloWorld">
        <p>Hello world!</p>
      </div>
    );
  }
});
