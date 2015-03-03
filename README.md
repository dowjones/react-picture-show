# React Picture Show [![Build Status](https://secure.travis-ci.org/areusjs/react-picture-show.png)](http://travis-ci.org/areusjs/react-picture-show) [![NPM version](https://badge.fury.io/js/react-picture-show.svg)](http://badge.fury.io/js/react-picture-show)

Basic Slideshow Component

## Basic Options

```javascript
  
  <PictureShow
    slides={[
      {width: 100, height: 100, src: ''},
      {width: 100, height: 100, src: ''}
    ]}
    ratio={[3,2]}
    onTransition={function(){}}
    startingSlide=1
    />

```

### Basic

```javascript
  var PictureShow = require('react-picture-show');

  var slides = [{
    width: 900,
    height: 600,
    src: 'http://placehold.it/900x600'
  }, {
    width: 600,
    height: 900,
    src: 'http://placehold.it/600x900'
  }, {
    width: 600,
    height: 600,
    src: 'http://placehold.it/600x600'
  }];

  // in jsx

  <PictureShow ratio={[3,2]} slides={slides}/>
```

### Configuration

__config__

## License

[MIT](/LICENSE)