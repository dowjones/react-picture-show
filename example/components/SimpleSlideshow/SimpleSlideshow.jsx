
var React = require('react'),
  PictureShow = require('../../../src/PictureShow.jsx'),
  SimpleSlideshow;

module.exports = SimpleSlideshow = React.createClass({
  render: function () {
    return (
      <div>
        <PictureShow className='simple-slideshow' ratio={[20,8]}>
          <p className='simple-slide' style={{background: 'tomato', color: 'yellow'}}>Slide One</p>
          <p className='simple-slide' style={{background: 'slategrey', color: 'smoke'}}>Slide Two</p>
          <p className='simple-slide' style={{background: 'pink', color: 'darkblue'}}>Slide Three</p>
          <p className='simple-slide' style={{background: 'darkblue', color: 'pink'}}>Slide Four</p>
        </PictureShow>
      </div>
    );
  }
});
