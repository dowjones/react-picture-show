
var React = require('react/addons'),
  Slide;

function extractShape (w, h, slideRatio) {
  return w/h < slideRatio[0]/slideRatio[1] ? 'tall' : 'wide';
}

function hasShape (w, h) {
  return typeof w === 'number' && typeof h === 'number';
}

module.exports = Slide = React.createClass({

  propTypes: {
    src: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    slideRatio: React.PropTypes.number,
    slidePending: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      slideRatio: 1
    };
  },

  render: function () {

    var width = this.props.width,
      height = this.props.height,
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
        <img className={['ps-img',shapeClass].join(' ')} style={imgStyle} src={this.props.src}/>
      </div>
    );
  }
});
