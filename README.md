# React Picture Show [![Build Status](https://secure.travis-ci.org/dowjones/react-picture-show.png)](http://travis-ci.org/dowjones/react-picture-show) [![NPM version](https://badge.fury.io/js/react-picture-show.svg)](http://badge.fury.io/js/react-picture-show)

A Bare bones slideshow component that handles transitions between slides and exposes control so that it is easy to decorate with other controls. Out of the box, it supports **swiping to paginate, clicking left and right, and lasyloading slides**

**[PictureShow Demo](http://areusjs.github.io/react-picture-show/)**

## installation

#### node

``` jsx
npm install react-picture-show
```

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

Properties | Type | Default | Description | Supported 
:--------- | :--- | :------ | :---------- | :-------- 
**[ratio](#ratio)** | ```Array``` | Null | Shape of the slideshow, for example: `[16,9]` | yes 
**[animationSpeed](#animationspeed)** | ```Number``` | 1500 | Speed of slide transitions in px/s | yes
**[startingSlide](#startingslide)** | ```Number``` | 0 | Initial slide view | yes
**[onClickSlide](#onClickSlide)** | ```Function``` | null | override click handler for slide | yes
**[onBeforeTransition](#onbeforetransition)** | ```Function``` | noop | Function called before transition starts | yes
**[onAfterTransition](#onaftertransition)** | ```Function``` | noop | Function called after transition ends | no
**[slideBuffer](#slidebuffer)** | ```Number``` | 1 | The number of slides loaded to the left and right of the slide in view | yes
**[clickDivide](#clickdivide)** | ```Number``` | 0.45 | The division between previous and next when clicking the slideshow | yes 
**[infinite](#infinite)** | ```Boolean``` | true | Is the Slideshow continuous | no
**[suppressPending](#suppresspending)** | ```Boolean``` | true | Should slides outside the slideBuffer be suppressed  | no

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
  slideRatio: Number, // the ratio of the outer slide (w/h)
  slidePending: Boolean // whether the slide can be lazyloaded
}
```
By cloning the children with these props, you are free to create 'slide' components that react to them however you want. If the child already has one of these props it will be replaced (even for ```<img/>``` components)

_Note: If ```suppressPending``` property is true on ```<PictureShow/>```, then the slide will not render, so you will not need to handle the ```pending``` prop at the slide level. ```suppressPending``` exists for edge cases where the user wants to define how 'not loading' works_

## Properties in Depth

#### ratio

Defines the shape of the slideshow as a fixed ratio so that it can flex inside its parent container.

#### animationSpeed

speed...

#### startingSlide

staring slide...

#### onClickSlide

function...

#### onBeforeTransition

function...

#### onAfterTransition 

function...

#### slideBuffer

lazy loading...

#### clickDivide

next and prev...

#### infinite

more stuff...

#### suppressPending

control pending....

## License

[MIT](/LICENSE)
