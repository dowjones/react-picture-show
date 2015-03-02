
var createDOM = require('../util/createDOM'),
  PictureShow = require('../PictureShow'),
  React = require('react/addons'),
  assert = require('should'),
  TestUtils = React.addons.TestUtils;

var slideshowElm, testSlides;

describe('PictureShow Structure', function () {

  beforeEach(function () {

    createDOM();

    testSlides = ['A','B','C','D'].map(function (letter) {
      return (<div className={letter}/>);
    });

    slideshowElm = (<PictureShow startingSlide={0} slides={testSlides} className='added-class'/>);

  });

  it('should add correct classes', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm),
      wrap,
      panels;

    slideshow.getDOMNode().className.should.match(/\bwsj-slideshow\b/);
    slideshow.getDOMNode().className.should.match(/\badded-class\b/);

    assert.doesNotThrow(function () {
      wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'wsj-slideshow-wrap');
    });

    panels = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'wsj-slideshow-slides');

    panels.length.should.equal(3);

  });

});
