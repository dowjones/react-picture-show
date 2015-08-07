var React = require('react'),
  PictureShow = require('../../../src/PictureShow.jsx'),
  Slide = require('../Slide/Slide.jsx'),
  ImageSlideshow;

module.exports = ImageSlideshow = React.createClass({
  render: function () {
    return (
      <div>
        <PictureShow className='image-slideshow' ratio={[3,2]}>
          <Slide src='http://placehold.it/300x300' width={300} height={300}/>
          <Slide src='http://placehold.it/600x400' width={600} height={400}/>
          <Slide src='http://placehold.it/400x600' width={400} height={600}/>
          <Slide src='http://placehold.it/1200x800' width={1200} height={800}/>
          <Slide src='http://placehold.it/1024x500' width={1024} height={500}/>
        </PictureShow>
      </div>
    );
  }
});
