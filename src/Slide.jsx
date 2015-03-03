
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
    content: React.PropTypes.object,
    slideRatio: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      content: {},
      slideRatio: 1
    };
  },

  render: function () {

    var width = this.props.content.width,
      height = this.props.content.height,
      check = hasShape(width, height),
      shapeClass = check ? extractShape(width, height, this.props.slideRatio) : 'stretch';

    var imgStyle;

    if (shapeClass === 'tall') {
      imgStyle = {
        maxHeight: height
      };
    } else if (shapeClass === 'wide') {
      imgStyle = {
        maxWidth: width
      };
    }

    return (
      <div className='ps-slide'>
        <img className={['ps-img',shapeClass].join(' ')} style={imgStyle} src={this.props.content.src}/>
      </div>
    );
  }
});
