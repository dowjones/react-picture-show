/** @jsx React.DOM */

var React = require('react/addons'),
  PictureShow = require('react-picture-show'), // temp untill dev is done
  App;

module.exports = App = React.createClass({

  statics: {
    init: function (id) {
      var container = document.getElementById(id);
      React.render(<App/>, container);
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

    var slides = 'ABCDEF'.split('').map(function (letter, idx) {

      var style = {
        background: idx%2 ? 'mediumseagreen' : 'slategray',
        color: 'white',
        textAlign: 'center',
        height: '100%'
      };

      return (
        <div style={style} width={300} height={300}>
          {letter}
        </div>
      );
    });

    return (
      <div style={{width: '50%'}}>
        hi there
        <PictureShow slides={slides} ratio={[2,1]} ref='slideshow'/>
        <div onClick={this.next}>next</div>
      </div>
    );
  }

});