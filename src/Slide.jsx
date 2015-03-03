
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
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    src: React.PropTypes.string,
    slideRatio: React.PropTypes.number
  },

  render: function () {

    var width = this.props.width,
      height = this.props.height,
      check = hasShape(width, height),
      shapeClass = check ? extractShape(width, height, this.props.slideRatio) : 'stretch';

    var imgStyle;

    if (shapeClass === 'tall') {
      imgStyle = {
        maxHeight: this.props.height
      };
    } else if (shapeClass === 'wide') {
      imgStyle = {
        maxWidth: this.props.width
      };
    }

    return (
      <div className='ps-slide'>
        <img className={['ps-img',shapeClass].join(' ')} style={imgStyle} />
      </div>
    );
  }
});
