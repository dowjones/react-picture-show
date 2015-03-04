/** @jsx React.DOM */

var React = require('react'),
  PictureShow = require('../../../src/PictureShow.jsx'),
  HelloWorld;

module.exports = HelloWorld = React.createClass({
  render: function () {
    return (
      <div className="HelloWorld">
        <PictureShow ratio={[16,9]}>
          <p>Hello world!</p>
          <p>Hello world!</p>
          <p>Hello world!</p>
        </PictureShow>
      </div>
    );
  }
});
