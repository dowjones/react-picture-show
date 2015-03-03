/** @jsx React.DOM */
/* globals window, navigator */

var throttle = require('lodash/function/throttle'),
  React = require('react/addons'),
  Swipeable = require('react-swipeable'),
  Slide = require('./Slide'),
  Slideshow;

function getTransitionTime (distance, speed) {
  // speed expressed in px/second
  // returns milliseconds
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
    clickDivide: React.PropTypes.number,
    fullscreen: React.PropTypes.bool
  },

  getDefaultProps: function (argument) {
    return {
      ratio: [3,2],
      startingSlide: 0,
      animationSpeed: 1500,
      slideBuffer: 1,
      clickDivide: 0.45,
      fullscreen: false
    };
  },

  componentDidMount: function () {

    // decide if we use 3d transforms
    // not in IE9 or iE8
    if (!support3d()) {
      this.setState({
        use3dFallback: true
      });
    }

    if (this.props.fullscreen) {
      this.handleResize();

      // TODO: make sure the poly fill is in our set of polyfills
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
      if (window.addEventListener) {
        window.addEventListener('resize', this.handleResize, false);
      }
    }
  },

  componentWillUnmount: function () {
    if (this.props.fullscreen) {
      // TODO: make sure the poly fill is in our set of polyfills
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
      if (window.addEventListener) {
        window.removeEventListener('resize', this.handleResize, false);
      }
    }
  },

  getInitialState: function () {

    this.preloaded = []; // store an bj on this instance

    return {
      slideIdx: this.props.startingSlide,
      panels: ['A','B','C'],
      use3dFallback: false
    };
  },

  handleResize: throttle(function () {
    var box = this.refs.wrap.getDOMNode().getBoundingClientRect();
    this.setState({
      ratio: box.width / box.height
    });
  }, 30),

  goToSlide: function (slideIdx, direction, event) {

    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    direction = direction || (slideIdx > this.state.slideIdx ? 'right' : 'left');

    var elm = this.getDOMNode(),
      width = elm.offsetWidth,
      // distance = this.getDistance(this.state.slideIdx, slideIdx, direction) * width,
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

  handleSlideClick: function (event) {

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

  handleSwipe: function (ev, x, y, isFlick) {
    this.setState({
      swiping: false
    });

    if (x > 0) {
      this.next();
    } else {
      this.previous();
    }
  },

  handleSwiping: function () {
    this.setState({
      swiping: true
    });
  },

  getDistance: function (startIdx, endIdx, direction) {
    return direction === 'left' ? this.getLeftDistance(startIdx, endIdx) : this.getRightDistance(startIdx, endIdx);
  },

  getLeftDistance: function (startIdx, endIdx) {
    var d = startIdx - endIdx;
    return d < 0 ? this.props.slides.length + d : d;
  },

  getRightDistance: function (startIdx, endIdx) {
    return this.getLeftDistance(endIdx, startIdx);
  },

  shouldLoad: function (slide, idx) {
    if (this.preloaded.indexOf(slide) > -1) {
      return true;
    } else if (this.getLeftDistance(this.state.slideIdx, idx) <= this.props.slideBuffer ||
               this.getRightDistance(this.state.slideIdx, idx) <= this.props.slideBuffer) {
      this.preloaded.push(slide);
      return true;
    } else {
      return false;
    }
  },

  render: function () {

    var self = this;

    var slots = this.props.slides.length,
      panelWidth = slots * 100,
      ratio = this.state.ratio || this.props.ratio[1] / this.props.ratio[0] * 100,
      panelPosition = this.state.slideIdx * -100;

    var fullScreenClass = this.props.fullscreen ? 'fullscreen' : undefined,
      mainClass = [
        this.props.className,
        'picture-show',
        fullScreenClass
      ].join(' ');

    var wrapStyle = !this.props.fullscreen ? {
      paddingBottom: ratio.toFixed(4) + "%"
    } : null;

    function getPanelStyle (idx, key) {
      var display = key === self.state.trickPanel ? 'none' : null,
        shift = (idx - 1) * panelWidth,
        left = (panelPosition + shift) + '%', // for IE
        transform = 'translate3d(' + ((panelPosition + shift)/self.props.slides.length) + '%,0,0)';

      if (self.state.use3dFallback) {
        return {
          WebkitTransitionDuration: self.state.animationTime + 'ms',
          transitionDuration: self.state.animationTime + 'ms',
          width: panelWidth + '%',
          left: left,
          display: display
        };
      } else {
        return {
          WebkitTransitionDuration: self.state.animationTime + 'ms',
          transitionDuration: self.state.animationTime + 'ms',
          width: panelWidth + '%',
          WebkitTransform: transform,
          MozTransform: transform,
          MsTransform: transform,
          transform: transform,
          display: display
        };
      }
    }

    var slideStyle = {
      width: (100 / slots) + '%'
    };

    var slides = this.props.slides.map(function (slide, idx) {
      if (this.shouldLoad(slide,idx)) {
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
        onSwiped={this.handleSwipe}
        onSwipeRight={this.handleSwiping}
        onSwipeLeft={this.handleSwiping}>
        <div className='ps-wrap' style={wrapStyle} ref='wrap'>
          {['A','B','C'].map(function (key) {
            var panelStyle = getPanelStyle(this.state.panels.indexOf(key), key);
            return (
              <div className='ps-slides' key={key} style={panelStyle} onMouseDown={this.handleSlideClick}>
                {slides}
              </div>
            );
          }.bind(this))}
        </div>
      </Swipeable>
    );
  }

});
