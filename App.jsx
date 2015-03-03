/** @jsx React.DOM */

var React = require('react/addons'),
  PictureShow = require('react-picture-show'),
  App;

module.exports = App = React.createClass({

  statics: {
    init: function (id) {
      var container = document.getElementById(id);
      React.render(<App/>, container);
    }
  },

  render: function () {

    var slides = 'ABCDEF'.split('').map(function (letter, idx) {

      var style = {
        background: idx%2 ? 'mediumseagreen' : 'slategray',
        color: 'white',
        textAlign: 'center'
      };

      return (
        <div style={style} width={300} height={300}>
          {letter}
        </div>
      );
    });

    return (
      <div style={{width: 500}}>
        hi there
        <PictureShow slides={slides} ratio={[1,1]}/>
      </div>
    );
  }

});