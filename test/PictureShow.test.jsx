
var createDOM = require('../util/createDOM'),
  PictureShow = require('../PictureShow'),
  React = require('react/addons'),
  TestUtils = React.addons.TestUtils;

describe('PictureShow', function () {

  beforeEach(createDOM);

  it('should do something', function () {

    var el = (<PictureShow slides={[]}/>);
    var mounted = TestUtils.renderIntoDocument(el);

    console.log(mounted);

  });

});
