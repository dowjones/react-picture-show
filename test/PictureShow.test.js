
var createDOM = require('../util/createDOM'),
  React = require('react/addons'),
  TestUtils = React.addons.TestUtils;

describe('PictureShow', function () {

  beforeEach(createDOM);

  it('should do something', function () {

    var el = React.createElement('div');
    var mounted = TestUtils.renderIntoDocument(el);

    TestUtils.Simulate.click(mounted);

    console.log(mounted);

  });


});
