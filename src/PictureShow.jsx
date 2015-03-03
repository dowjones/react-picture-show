/** @jsx React.DOM */
/* globals window, navigator */

var throttle = require('lodash/function/throttle'),
  React = require('react/addons'),
  Swipeable = require('react-swipeable'),
  Slide = require('./Slide'),
  Slideshow;

// speed expressed in px/second
// returns milliseconds
function getTransitionTime (distance, speed) {
  return distance / speed * 1000;
}

function support3d () {
  var v = getInternetExplorerVersion();
  return v > -1 ? v > 9 : true;
}

// adapted from: http://blogs.msdn.com/b/giorgio/archive/2009/04/14/how-to-detect-ie8-using-javascript-client-side.aspx
function getInternetExplorerVersion(minimum) {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName === 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) !== null) {
        rv = parseFloat(RegExp.$1);
      }
  }
  return rv;
}

module.exports = Slideshow = React.createClass({

  propTypes: {
    slides: React.PropTypes.array.isRequired,
    ratio: React.PropTypes.array,
    startingSlide: React.PropTypes.number,
    animationSpeed: React.PropTypes.number,
    slideBuffer: React.PropTypes.number,
    clickDivide: React.PropTypes.number
  },

  getDefaultProps: function (argument) {
    return {
      ratio: null,
      startingSlide: 0,
      animationSpeed: 1500,
      slideBuffer: 1,
      clickDivide: 0.45,
    };
  },

  getInitialState: function () {

    // store an object on this instance
    this.preloaded = []; 

    return {
      slideIdx: this.props.startingSlide,
      panels: ['A','B','C'],
      ratio: 3/2,
      use3dFallback: false
    };
  },

  // TODO: make sure the poly fill is in our set of polyfills
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
  componentDidMount: function () {

    // decide if we use 3d transforms
    // not in IE9 or iE8
    if (!support3d()) {
      this.setState({
        use3dFallback: true
      });
    }

    if (!this.props.ratio) {
      this._handleResize();

      if (window.addEventListener) {
        window.addEventListener('resize', this._handleResize, false);
      }
    }
  },

  componentWillUnmount: function () {
    if (!this.props.ratio && window.removeEventListener) {
      window.removeEventListener('resize', this._handleResize, false);
    }
  },

  goToSlide: function (slideIdx, direction, event) {

    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    direction = direction || (slideIdx > this.state.slideIdx ? 'right' : 'left');

    var elm = this.getDOMNode(),
      width = elm.offsetWidth,
      animationTime = getTransitionTime(width, this.props.animationSpeed);

    var panels = this.state.panels,
      trickPanel;

    if (slideIdx === this.state.slideIdx) {
      return;
    } else if (direction === 'right' && slideIdx < this.state.slideIdx) {
      trickPanel = panels.shift();
      panels.push(trickPanel);
    } else if (direction === 'left' && slideIdx > this.state.slideIdx) {
      trickPanel = panels.pop();
      panels.unshift(trickPanel);
    } else {
      trickPanel = null;
    }

    this.setState({
      slideIdx: slideIdx,
      direction: direction,
      panels: panels,
      trickPanel: trickPanel,
      animationTime: animationTime,
    });
  },

  next: function (event) {
    this.goToSlide(this.state.slideIdx < this.props.slides.length - 1 ? this.state.slideIdx + 1 : 0, 'right', event);
  },

  previous: function (event) {
    this.goToSlide(this.state.slideIdx > 0 ? this.state.slideIdx - 1 : this.props.slides.length - 1, 'left', event);
  },

  _handleResize: throttle(function () {
    var box = this.refs.wrap.getDOMNode().getBoundingClientRect();
    this.setState({
      ratio: box.width / box.height
    });
  }, 30),

  _handleSlideClick: function (event) {
    if (this.state.swiping) {
      return;
    }

    var elm = this.getDOMNode(),
      box = elm.getBoundingClientRect(),
      left = box.left,
      right = left + box.width,
      divide = left + ((right - left) * this.props.clickDivide);

    if (event.clientX < divide) {
      this.previous();
    } else {
      this.next();
    }
  },

  _handleSwipe: function (ev, x, y, isFlick) {
    this.setState({
      swiping: false
    });

    if (x > 0) {
      this.next();
    } else {
      this.previous();
    }
  },

  _handleSwiping: function () {
    // TODO: track finger
    this.setState({
      swiping: true
    });
  },

  _getLeftDistance: function (startIdx, endIdx) {
    var d = startIdx - endIdx;
    return d < 0 ? this.props.slides.length + d : d;
  },

  _getRightDistance: function (startIdx, endIdx) {
    return this._getLeftDistance(endIdx, startIdx);
  },

  _shouldLoad: function (slide, idx) {
    if (this.preloaded.indexOf(slide) > -1) {
      return true;
    } else if (this._getLeftDistance(this.state.slideIdx, idx) <= this.props.slideBuffer ||
               this._getRightDistance(this.state.slideIdx, idx) <= this.props.slideBuffer) {
      this.preloaded.push(slide);
      return true;
    } else {
      return false;
    }
  },

  _getPanelStyle: function (idx, key) {

    var slots = this.props.slides.length,
      panelWidth = slots * 100,
      panelPosition = this.state.slideIdx * -100;

    var display = key === this.state.trickPanel ? 'none' : null,
      shift = (idx - 1) * panelWidth,
      left = (panelPosition + shift) + '%', // for IE
      transform = 'translate3d(' + ((panelPosition + shift)/this.props.slides.length) + '%,0,0)';

    if (this.state.use3dFallback) {
      return {
        WebkitTransitionDuration: this.state.animationTime + 'ms',
        transitionDuration: this.state.animationTime + 'ms',
        width: panelWidth + '%',
        left: left,
        display: display
      };
    } else {
      return {
        WebkitTransitionDuration: this.state.animationTime + 'ms',
        transitionDuration: this.state.animationTime + 'ms',
        width: panelWidth + '%',
        WebkitTransform: transform,
        MozTransform: transform,
        MsTransform: transform,
        transform: transform,
        display: display
      };
    }
  },

  render: function () {

    var ratio = this.props.ratio ? this.props.ratio[1] / this.props.ratio[0] * 100 : this.state.ratio;

    var mainClass = [
      'picture-show',
      (!this.props.ratio ? 'stretch' : undefined),
      this.props.className
    ].join(' ');

    var wrapStyle = this.props.ratio ? {
      paddingBottom: ratio.toFixed(4) + "%"
    } : null;

    var slideStyle = {
      width: (100 / this.props.slides.length) + '%'
    };

    var slides = this.props.slides.map(function (slide, idx) {
      if (this._shouldLoad(slide,idx)) {
        return (
          <div className='ps-slide-wrap' key={idx} style={slideStyle}>
            <Slide slideRatio={ratio} content={slide}/>
          </div>
        );
      } else {
        return (
          <div className='ps-slide-wrap pending-slide' key={idx} style={slideStyle} />
        );
      }
    }.bind(this));

    return (
      <Swipeable
        className={mainClass}
        onSwiped={this._handleSwipe}
        onSwipeRight={this._handleSwiping}
        onSwipeLeft={this._handleSwiping}>
        <div className='ps-wrap' style={wrapStyle} ref='wrap'>
          {['A','B','C'].map(function (key) {
            var panelStyle = this._getPanelStyle(this.state.panels.indexOf(key), key);
            return (
              <div className='ps-slides' key={key} style={panelStyle} onMouseDown={this._handleSlideClick}>
                {slides}
              </div>
            );
          }.bind(this))}
        </div>
      </Swipeable>
    );
  }

});
