
var PictureShow = require('../src/PictureShow.jsx'), 
  sinon = require('sinon'),
  React = require('react/addons'),
  assert = require('should'),
  TestUtils = React.addons.TestUtils;

var slideshowElm, PictureShow;

function setUp () {
  slideshowElm = (
    <PictureShow startingSlide={0} className='added-class' ratio={[3,2]}>
      <img className='A'/>
      <img className='B'/>
      <img className='C'/>
      <img className='D'/>
    </PictureShow>
  );
}

describe('PictureShow Structure', function () {

  beforeEach(setUp);

  it('should apply correct classes', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm),
      wrap,
      panels;

    slideshow.getDOMNode().className.should.match(/\bpicture-show\b/);
    slideshow.getDOMNode().className.should.match(/\badded-class\b/);

    assert.doesNotThrow(function () {
      wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'ps-wrap');
    });

    panels = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'ps-slides');

    panels.length.should.equal(3);

  });

  it('should apply inline styles correctly', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'ps-wrap');
    var panel = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'ps-slides')[0];
    var slide = TestUtils.scryRenderedDOMComponentsWithClass(panel, 'ps-slide-wrap')[0];
    var slideCount = React.Children.count(slideshow.props.children);


    wrap.props.style.paddingBottom.should.equal('66.6667%');
    panel.props.style.width.should.equal((slideCount * 100) + '%');
    slide.props.style.width.should.equal((100/slideCount) + '%');

  });

  it('should use ratio of element when no ratio is supplied', function () {

    var elm = (
      <PictureShow>
        <div className='A'/>
        <div className='B'/>
        <div className='C'/>
      </PictureShow>
    );

    var slideshow = TestUtils.renderIntoDocument(elm);

    slideshow.refs.wrap.props.should.have.property('style', null);

  });

  it('should add a listener to window resize if no ratio is supplied', function () {

    window.addEventListener = sinon.spy();

    var elm = (
      <PictureShow>
        <div className='A'/>
        <div className='B'/>
        <div className='C'/>
      </PictureShow>
    );

    var slideshow = TestUtils.renderIntoDocument(elm);

    window.addEventListener.calledWith('resize',slideshow._handleResize).should.be.true;

  });

  // TODO: add test for slide structure

});

describe('PictureShow Navigation', function () {

  beforeEach(setUp);

  it('should position panels correctly on next', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'ps-wrap');
    var panels = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'ps-slides');
    var slideCount = React.Children.count(slideshow.props.children);

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

  it('should position panels correctly on previous', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'ps-wrap');
    var panels = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'ps-slides');
    var slideCount = React.Children.count(slideshow.props.children);

    function getShift (idx, panelPosition) {
      panelPosition = (panelPosition - 1) * slideCount;
      return 'translate3d(' + ((100 / slideCount) * (-idx + panelPosition)) + '%,0,0)';
    }

    // slide 0

    panels[0].props.style.transform.should.equal(getShift(0, 0));
    panels[1].props.style.transform.should.equal(getShift(0, 1));
    panels[2].props.style.transform.should.equal(getShift(0, 2));

    slideshow.previous(); // slide 3 <---- around the seam

    panels[0].props.style.transform.should.equal(getShift(3, 1));
    panels[1].props.style.transform.should.equal(getShift(3, 2));
    panels[2].props.style.transform.should.equal(getShift(3, 0));

    slideshow.previous(); // slide 2

    panels[0].props.style.transform.should.equal(getShift(2, 1));
    panels[1].props.style.transform.should.equal(getShift(2, 2));
    panels[2].props.style.transform.should.equal(getShift(2, 0));

    slideshow.previous(); // slide 1

    panels[0].props.style.transform.should.equal(getShift(1, 1));
    panels[1].props.style.transform.should.equal(getShift(1, 2));
    panels[2].props.style.transform.should.equal(getShift(1, 0));

    slideshow.previous(); // slide 0

    panels[0].props.style.transform.should.equal(getShift(0, 1));
    panels[1].props.style.transform.should.equal(getShift(0, 2));
    panels[2].props.style.transform.should.equal(getShift(0, 0));

    slideshow.next(); // just double checking a turn

    panels[0].props.style.transform.should.equal(getShift(1, 1));
    panels[1].props.style.transform.should.equal(getShift(1, 2));
    panels[2].props.style.transform.should.equal(getShift(1, 0));

  });

  it('should jump to slides correctly', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var wrap = TestUtils.findRenderedDOMComponentWithClass(slideshow, 'ps-wrap');
    var panels = TestUtils.scryRenderedDOMComponentsWithClass(wrap, 'ps-slides');
    var slideCount = React.Children.count(slideshow.props.children);

    function getShift (idx, panelPosition) {
      panelPosition = (panelPosition - 1) * slideCount;
      return 'translate3d(' + ((100 / slideCount) * (-idx + panelPosition)) + '%,0,0)';
    }

    slideshow.goToSlide(3);

    panels[0].props.style.transform.should.equal(getShift(3, 0));
    panels[1].props.style.transform.should.equal(getShift(3, 1));
    panels[2].props.style.transform.should.equal(getShift(3, 2));

    slideshow.goToSlide(0);

    panels[0].props.style.transform.should.equal(getShift(0, 0));
    panels[1].props.style.transform.should.equal(getShift(0, 1));
    panels[2].props.style.transform.should.equal(getShift(0, 2));

  });

});

describe('PictureShow Preloading', function () {

  it('should not load panels outside slide buffer', function () {

    var elm = (
      <PictureShow>
        <div className='A'/>
        <div className='B'/>
        <div className='C'/>
        <div className='D'/>
        <div className='E'/>
        <div className='F'/>
      </PictureShow>
    );

    var slideshow = TestUtils.renderIntoDocument(elm);
    var panel = TestUtils.scryRenderedDOMComponentsWithClass(slideshow, 'ps-slides')[0];
    var slides = TestUtils.scryRenderedDOMComponentsWithClass(panel, 'ps-slide-wrap');

    // should load slides
    assert.doesNotThrow(function(){TestUtils.findRenderedDOMComponentWithClass(slides[0], 'A');});
    assert.doesNotThrow(function(){TestUtils.findRenderedDOMComponentWithClass(slides[1], 'B');});
    assert.doesNotThrow(function(){TestUtils.findRenderedDOMComponentWithClass(slides[5], 'F');});

    // should not be loaded
    assert.throws(function(){TestUtils.findRenderedDOMComponentWithClass(slides[2], 'C');});
    assert.throws(function(){TestUtils.findRenderedDOMComponentWithClass(slides[3], 'D');});
    assert.throws(function(){TestUtils.findRenderedDOMComponentWithClass(slides[4], 'E');});

    slideshow.next(); // now 2 should load

    assert.doesNotThrow(function(){TestUtils.findRenderedDOMComponentWithClass(slides[2], 'C');});
    assert.throws(function(){TestUtils.findRenderedDOMComponentWithClass(slides[3], 'D');});
    assert.throws(function(){TestUtils.findRenderedDOMComponentWithClass(slides[4], 'E');});

    slideshow.next(); // now 3 should load

    assert.doesNotThrow(function(){TestUtils.findRenderedDOMComponentWithClass(slides[3], 'D');});

    slideshow.previous();
    slideshow.previous();
    slideshow.previous();

    assert.doesNotThrow(function(){TestUtils.findRenderedDOMComponentWithClass(slides[4], 'E');});

  });

});

describe('PictureShow Interaction', function () {

  beforeEach(setUp);

  it('should paginate on mouse down', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var panel = TestUtils.scryRenderedDOMComponentsWithClass(slideshow, 'ps-slides')[1];
    var node = slideshow.getDOMNode();
    var originalFn = node.getBoundingClientRect;

    node.getBoundingClientRect = function () {
      return {
        left: 100,
        width: 200
      };
    };

    TestUtils.Simulate.mouseDown(panel, {
      clientX: 180 // previous
    });

    slideshow.state.slideIdx.should.equal(3);

    TestUtils.Simulate.mouseDown(panel, {
      clientX: 210 // next
    });

    TestUtils.Simulate.mouseDown(panel, {
      clientX: 220 // next
    });

    slideshow.state.slideIdx.should.equal(1);

    node.getBoundingClientRect = originalFn; // replace original function

  });

  it('should paginate on swipe', function () {

    var slideshow = TestUtils.renderIntoDocument(slideshowElm);
    var node = slideshow.getDOMNode();

    // finger moving right

    TestUtils.Simulate.touchStart(node, {
      touches: [{clientX: 180, clientY: 100}]
    });
    TestUtils.Simulate.touchMove(node, {
      touches: [{clientX: 200, clientY: 100}],
      changedTouches: [{clientX: 200, clientY: 100}]
    });
    TestUtils.Simulate.touchEnd(node, {
      touches: [{clientX: 240, clientY: 100}],
      changedTouches: [{clientX: 240, clientY: 100}]
    });

    slideshow.state.slideIdx.should.equal(3);

    // finger moving left

    TestUtils.Simulate.touchStart(node, {
      touches: [{clientX: 180, clientY: 100}]
    });
    TestUtils.Simulate.touchMove(node, {
      touches: [{clientX: 170, clientY: 100}],
      changedTouches: [{clientX: 170, clientY: 100}]
    });
    TestUtils.Simulate.touchEnd(node, {
      touches: [{clientX: 140, clientY: 100}],
      changedTouches: [{clientX: 140, clientY: 100}]
    });

    slideshow.state.slideIdx.should.equal(0);

  });

});

describe('PictureShow Events', function () {

  beforeEach(setUp);

  it('should run `onTransition`', function () {

    var cb = sinon.spy();
    
    var elm = React.addons.cloneWithProps(slideshowElm, {
      onBeforeTransition: cb
    });

    var slideshow = TestUtils.renderIntoDocument(elm);

    slideshow.next();

    cb.lastCall.args.should.eql([0,1]);

    slideshow.next();

    cb.lastCall.args.should.eql([1,2]);

    slideshow.previous();

    cb.lastCall.args.should.eql([2,1]);
    
  });

  it('should run `onClickSlide`', function () {
    var cb = sinon.spy();
    
    var elm = React.addons.cloneWithProps(slideshowElm, {
      onClickSlide: cb
    });

    var slideshow = TestUtils.renderIntoDocument(elm);
    var panel = TestUtils.scryRenderedDOMComponentsWithClass(slideshow, 'ps-slides')[1];
    var node = slideshow.getDOMNode();
    var originalFn = node.getBoundingClientRect;

    node.getBoundingClientRect = function () {
      return {
        left: 100,
        width: 200
      };
    };

    TestUtils.Simulate.mouseDown(panel, {
      clientX: 210 // next
    });

    cb.lastCall.args[0].should.equal('next');
    slideshow.state.slideIdx.should.equal(0); // should not fall through to next

    node.getBoundingClientRect = originalFn; // replace original function
  });

});

describe('PictureShow Children', function () {

  beforeEach(setUp);

  it('clone children with correct props', function () {

    var elm = (
      <PictureShow suppressPending={false} ratio={[1,2]}>
        <img className='A'/>
        <img className='B'/>
        <img className='C'/>
        <img className='D'/>
        <img className='E'/>
        <img className='F'/>
      </PictureShow>
    );

    var slideshow = TestUtils.renderIntoDocument(elm);
    var slideChildren = TestUtils.scryRenderedDOMComponentsWithTag(slideshow, 'img');

    slideChildren[0].props.should.eql({
      slideRatio: [1,2],
      slidePending: false,
      className: 'A'
    });

    slideChildren[2].props.should.eql({
      slideRatio: [1,2],
      slidePending: true,
      className: 'C'
    });
    
  });

});
