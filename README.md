# React Picture Show [![Build Status](https://secure.travis-ci.org/skiano/react-picture-show.png)](http://travis-ci.org/skiano/react-picture-show) [![NPM version](https://badge.fury.io/js/react-picture-show.svg)](http://badge.fury.io/js/react-picture-show)

A Bare bones slideshow component that handles transitions between slides and exposes control so that it is easy to decorate with other features.

**[PictureShow Demo](http://areusjs.github.io/react-picture-show/)**

## installation

#### node

``` jsx
  npm install react-picture-show
```

The package includes lib/PictureShow.css and src/PictureShow.scss.

## Usage

#### Basic

```jsx
  
  <PictureShow>
    <img src='http://...'/>
    <img src='http://...'/>
    <div>another thing</div>
    <img src='http://...'/>
    <img src='http://...'/>
  </PictureShow>

```

### Component Properties Overview

Properties | Type | Default Value | Description | Supported 
:--------- | :--- | :------ | :---------- | :-------- 
**ratio** | ```array [w,h]``` | Null | Creates a fixed-ratio slideshow / otherwise it stretches to fill its parent, for example `[16,9]` | yes 
**animationSpeed** | ```number``` | 1500 | Roughly how many px/s the slide should move during transitions | yes
**startingSlide** | ```number``` | 0 | The index of the slide to view first | yes
**onBeforeTransition** | ```function(current, next)``` | noop | Called before transition starts | yes
**onAfterTransition** | ```function(prev, current)``` | noop | Called after transition ends | no
**slideBuffer** | ```number``` | 1 | The number of slides should be marked as inview to the left and right | yes
**clickDivide** | ```number 0–1``` | 0.45 | Where the line between previous and next should fall when clicking the slideshow | yes 
**infinite** | bool | true | Slideshow is continuous | no
**nullPending** | bool | true | Pending slides are not rendered | no

### Public methods on mounted component

Method | Description | Supported 
:----- | :---------- | :--------
next | Go forward one slide | yes
previous | Go backward one slide | yes 
goToSlide | Go to a specific slide index | yes
disable | Deactivate slideshow | no
enable | Acticate slideshow | no

### How slides work

Slides are the direct child components of a ``<PictureShow/>``. They are cloned with the following additional properties:

```jsx
  {
    width: Number, // the width of the mounted slideshow
    height: Number, // the height of the mounted slideshow
    pending: Boolean // whether the slide can be lazyloaded
  }
```
By cloning the children with these props, you are free to create 'slide' components that react to them however you want. If the child already has one of these props it will be replaced (even for ```<img/>``` components)

## License

[MIT](/LICENSE)
