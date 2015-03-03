
/** @jsx React.DOM */

var React = require('react/addons'),
  Slide;

function extractShape (w, h, slideRatio) {
  return w/h < slideRatio ? 'tall' : 'wide';
}

function hasShape (w, h) {
  return typeof w === 'number' && typeof h === 'number';
}

module.exports = Slide = React.createClass({

  propTypes: {
    width: React.propTypes.number,
    height: React.propTypes.number,
    slideRatio: React.PropTypes.number
  },

  render: function () {

    var width = this.props.width,
      height = this.props.height,
      check = hasShape(width, height),
      shapeClass = check ? extractShape(width, height, this.props.slideRatio) : 'stretch';

    var imgClass = [
      'ps-slide',
      shapeClass
    ].join(' ');

    var imgStyle;

    if (shapeClass === 'tall') {
      imgStyle = {
        maxHeight: this.props.height
      };
    } else {
      imgStyle = {
        maxWidth: this.props.width
      };
    }

    return (
      <div className={imgClass} style={imgStyle}>
        {this.props.children}
      </div>
    );
  }
});
