(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.App = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  PictureShow = require('react-picture-show'), // temp untill dev is done
  App;

module.exports = App = React.createClass({displayName: "App",

  statics: {
    init: function (id) {
      var container = document.getElementById(id);
      React.render(React.createElement(App, null), container);
    }
  },

  getInitialState: function () {
    return {
      slideIdx: 0
    };
  },

  next: function () {
    this.refs.slideshow.next();
    this.setState({
      slideIdx: this.state.slideIdx + 1
    });
  },

  render: function () {

    var slides = [
      [300,300],
      [700,500],
      [500,700],
      [126,100],
    ].map(function (shape, idx) {
      return {
        width: shape[0],
        height: shape[1],
        src: 'http://placehold.it/'+shape[0]+'x'+shape[1]
      };
    });

    return (
      React.createElement("div", {style: {
        width: '50%',
        margin: '40px auto'
      }}, 
        React.createElement(PictureShow, {slides: slides, ratio: [2,1], ref: "slideshow"}), 
        React.createElement("div", {style: {
          padding: 10,
          display: 'inline-block',
          marginTop: 10,
          background: 'tomato',
          color: '#fff',
          cursor: 'pointer'
        }, onClick: this.next}, "next")
      )
    );
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react-picture-show":2}],2:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
/* globals window, navigator */

var throttle = require('lodash/function/throttle'),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
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

module.exports = Slideshow = React.createClass({displayName: "Slideshow",

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
          React.createElement("div", {className: "ps-slide-wrap", key: idx, style: slideStyle}, 
            React.createElement(Slide, {slideRatio: ratio, content: slide})
          )
        );
      } else {
        return (
          React.createElement("div", {className: "ps-slide-wrap pending-slide", key: idx, style: slideStyle})
        );
      }
    }.bind(this));

    return (
      React.createElement(Swipeable, {
        className: mainClass, 
        onSwiped: this.handleSwipe, 
        onSwipeRight: this.handleSwiping, 
        onSwipeLeft: this.handleSwiping}, 
        React.createElement("div", {className: "ps-wrap", style: wrapStyle, ref: "wrap"}, 
          ['A','B','C'].map(function (key) {
            var panelStyle = getPanelStyle(this.state.panels.indexOf(key), key);
            return (
              React.createElement("div", {className: "ps-slides", key: key, style: panelStyle, onMouseDown: this.handleSlideClick}, 
                slides
              )
            );
          }.bind(this))
        )
      )
    );
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Slide":3,"lodash/function/throttle":6,"react-swipeable":12}],3:[function(require,module,exports){
(function (global){

/** @jsx React.DOM */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  Slide;

function extractShape (w, h, slideRatio) {
  return w/h < slideRatio ? 'tall' : 'wide';
}

function hasShape (w, h) {
  return typeof w === 'number' && typeof h === 'number';
}

module.exports = Slide = React.createClass({displayName: "Slide",

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
      React.createElement("div", {className: "ps-slide"}, 
        React.createElement("img", {className: ['ps-img',shapeClass].join(' '), style: imgStyle, src: this.props.content.src})
      )
    );
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var isNative = require('../lang/isNative');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeNow = isNative(nativeNow = Date.now) && nativeNow;

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../lang/isNative":9}],5:[function(require,module,exports){
var isObject = require('../lang/isObject'),
    now = require('../date/now');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time it was invoked. The created function comes
 * with a `cancel` method to cancel delayed invocations. Provide an options
 * object to indicate that `func` should be invoked on the leading and/or
 * trailing edge of the `wait` timeout. Subsequent calls to the debounced
 * function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it is invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      var isCalled = trailingCall;
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
      }
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (trailing || (maxWait !== wait)) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = null;
      }
    }
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = null;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

module.exports = debounce;

},{"../date/now":4,"../lang/isObject":10}],6:[function(require,module,exports){
var debounce = require('./debounce'),
    isObject = require('../lang/isObject');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as an internal `_.debounce` options object by `_.throttle`. */
var debounceOptions = {
  'leading': false,
  'maxWait': 0,
  'trailing': false
};

/**
 * Creates a function that only invokes `func` at most once per every `wait`
 * milliseconds. The created function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the throttled function return the result of the last
 * `func` call.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the throttled function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=true] Specify invoking on the leading
 *  edge of the timeout.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // avoid excessively updating the position while scrolling
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
 *   'trailing': false
 * }));
 *
 * // cancel a trailing throttled call
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (options === false) {
    leading = false;
  } else if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  debounceOptions.leading = leading;
  debounceOptions.maxWait = +wait;
  debounceOptions.trailing = trailing;
  return debounce(func, wait, debounceOptions);
}

module.exports = throttle;

},{"../lang/isObject":10,"./debounce":5}],7:[function(require,module,exports){
/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],8:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return (value && typeof value == 'object') || false;
}

module.exports = isObjectLike;

},{}],9:[function(require,module,exports){
var escapeRegExp = require('../string/escapeRegExp'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the `toStringTag` of values.
 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * for more details.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return (isObjectLike(value) && reHostCtor.test(value)) || false;
}

module.exports = isNative;

},{"../internal/isObjectLike":8,"../string/escapeRegExp":11}],10:[function(require,module,exports){
/**
 * Checks if `value` is the language type of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (value && type == 'object') || false;
}

module.exports = isObject;

},{}],11:[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/**
 * Used to match `RegExp` special characters.
 * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
 * for more details.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
 * "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"../internal/baseToString":7}],12:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null)
var assign = require('object-assign')

var Swipeable = React.createClass({
  propTypes: {
    onSwiped: React.PropTypes.func,
    onSwipingUp: React.PropTypes.func,
    onSwipingRight: React.PropTypes.func,
    onSwipingDown: React.PropTypes.func,
    onSwipingLeft: React.PropTypes.func,
    flickThreshold: React.PropTypes.number,
    delta: React.PropTypes.number
  },

  getInitialState: function () {
    return {
      x: null,
      y: null,
      swiping: false,
      start: 0
    }
  },

  getDefaultProps: function () {
    return {
      flickThreshold: 0.6,
      delta: 10
    }
  },

  calculatePos: function (e) {
    var x = e.changedTouches[0].clientX
    var y = e.changedTouches[0].clientY

    var xd = this.state.x - x
    var yd = this.state.y - y

    var axd = Math.abs(xd)
    var ayd = Math.abs(yd)

    return {
      deltaX: xd,
      deltaY: yd,
      absX: axd,
      absY: ayd
    }
  },

  touchStart: function (e) {
    if (e.touches.length > 1) {
      return
    }
    this.setState({
      start: Date.now(),
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      swiping: false
    })
  },

  touchMove: function (e) {
    if (!this.state.x || !this.state.y || e.touches.length > 1) {
      return
    }

    var cancelPageSwipe = false
    var pos = this.calculatePos(e)

    if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
      return
    }

    if (pos.absX > pos.absY) {
      if (pos.deltaX > 0) {
        if (this.props.onSwipingLeft) {
          this.props.onSwipingLeft(e, pos.absX)
          cancelPageSwipe = true
        }
      } else {
        if (this.props.onSwipingRight) {
          this.props.onSwipingRight(e, pos.absX)
          cancelPageSwipe = true
        }
      }
    } else {
      if (pos.deltaY < 0) {
        if (this.props.onSwipingUp) {
          this.props.onSwipingUp(e, pos.absY)
          cancelPageSwipe = true
        }
      } else {
        if (this.props.onSwipingDown) {
          this.props.onSwipingDown(e, pos.absY)
          cancelPageSwipe = true
        }
      }
    }

    this.setState({ swiping: true })

    if (cancelPageSwipe) {
      e.preventDefault()
    }
  },

  touchEnd: function (ev) {
    if (this.state.swiping) {
      var pos = this.calculatePos(ev)

      var time = Date.now() - this.state.start
      var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time
      var isFlick = velocity > this.props.flickThreshold

      this.props.onSwiped && this.props.onSwiped(
        ev,
        pos.deltaX,
        pos.deltaY,
        isFlick
      )
    }
    this.setState(this.getInitialState())
  },

  render: function () {
    return React.createElement('div', assign({
      onTouchStart: this.touchStart,
      onTouchMove: this.touchMove,
      onTouchEnd: this.touchEnd
    }, this.props), this.props.children)
  }
})

module.exports = Swipeable

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":13}],13:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}]},{},[1])(1)
});