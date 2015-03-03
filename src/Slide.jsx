
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

    var img = React.Children.only(this.props.children);

    return (
      <div className='ps-slide'>
        {React.addons.cloneWithProps(img, {
          style: imgStyle,
          className: ['ps-img',shapeClass].join(' ')
        })}
      </div>
    );
  }
});
