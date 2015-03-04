/** @jsx React.DOM */

var React = require('react'),
  PictureShow = require('../../../src/PictureShow.jsx'),
  Slide = require('../Slide/Slide.jsx'),
  ImageSlideshow;

module.exports = ImageSlideshow = React.createClass({
  render: function () {
    return (
      <div className="HelloWorld">
        <PictureShow ratio={[16,9]}>
          <Slide src='http://placehold.it/300x300' width={300} height={300}/>
          <Slide src='http://placehold.it/300x300' width={300} height={300}/>
          <Slide src='http://placehold.it/300x300' width={300} height={300}/>
        </PictureShow>
      </div>
    );
  }
});
