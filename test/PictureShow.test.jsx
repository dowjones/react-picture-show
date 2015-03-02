
var PictureShow = require('../PictureShow'),
  React = require('react/addons'),
  assert = require('should'),
  TestUtils = React.addons.TestUtils;

var slideshowElm, testSlides;

function setUp () {

  // createDOM();

  testSlides = ['A','B','C','D'].map(function (letter) {
    return (<div className={letter}/>);
  });

  slideshowElm = (<PictureShow startingSlide={0} slides={testSlides} className='added-class'/>);
}

describe('PictureShow Structure', function () {

  beforeEach(setUp);

  it('should apply correct classes', function () {

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

  it('should apply inline styles correctly', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'wsj-slideshow-wrap');
    var panel = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'wsj-slideshow-slides')[0];
    var slide = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'wsj-slide-wrap')[0];

    wrap.props.style.paddingBottom.should.equal('66.6667%');
    panel.props.style.width.should.equal((slideshow.props.slides.length * 100) + '%');
    slide.props.style.width.should.equal((100/slideshow.props.slides.length) + '%');

  });

  // TODO: add test for slide structure

});

describe('PictureShow Navigation', function () {

  beforeEach(setUp);

  it('should position panels correctly on next', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'wsj-slideshow-wrap');
    var panels = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'wsj-slideshow-slides');
    var slideCount = slideshow.props.slides.length;

    function getShift (idx, panelPosition) {
      panelPosition = (panelPosition - 1) * slideCount;
      return 'translate3d(' + ((100 / slideCount) * (-idx + panelPosition)) + '%,0,0)';
    }

    // slide 0

    panels[0].props.style.transform.should.equal(getShift(0, 0));
    panels[1].props.style.transform.should.equal(getShift(0, 1));
    panels[2].props.style.transform.should.equal(getShift(0, 2));

    slideshow.next(); // slide 1

    panels[0].props.style.transform.should.equal(getShift(1, 0));
    panels[1].props.style.transform.should.equal(getShift(1, 1));
    panels[2].props.style.transform.should.equal(getShift(1, 2));

    slideshow.next(); // slide 2

    panels[0].props.style.transform.should.equal(getShift(2, 0));
    panels[1].props.style.transform.should.equal(getShift(2, 1));
    panels[2].props.style.transform.should.equal(getShift(2, 2));

    slideshow.next(); // slide 3

    panels[0].props.style.transform.should.equal(getShift(3, 0));
    panels[1].props.style.transform.should.equal(getShift(3, 1));
    panels[2].props.style.transform.should.equal(getShift(3, 2));

    slideshow.next(); // slide 0 <---- around the seam

    panels[0].props.style.transform.should.equal(getShift(0, 2));
    panels[1].props.style.transform.should.equal(getShift(0, 0));
    panels[2].props.style.transform.should.equal(getShift(0, 1));

  });

});
