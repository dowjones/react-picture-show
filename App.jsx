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
  },

  previous: function () {
    this.refs.slideshow.previous();
  },

  onTransition: function (previous, next) {
    this.setState({
      slideIdx: next
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

    var ratio = null;

    ratio = [3,2];

    return (
      <div style={{
        width: '50%',
        margin: '40px auto'
      }}>
        <PictureShow 
          slides={slides} 
          ratio={ratio} 
          onTransition={this.onTransition}
          ref='slideshow'/>

        <div style={{
          marginTop: 10,
          color: 'tomato',
          textAlign: 'center'
        }}>

          {this.state.slideIdx + 1} of {slides.length}

          <div style={{
            float: 'right',
            padding: 10,
            display: 'inline-block',
            background: 'tomato',
            color: '#fff',
            cursor: 'pointer'
          }} onClick={this.next}>next</div>

          <div style={{
            float: 'left',
            padding: 10,
            display: 'inline-block',
            background: 'tomato',
            color: '#fff',
            cursor: 'pointer'
          }} onClick={this.previous}>prev</div>


        </div>
      </div>
    );
  }

});