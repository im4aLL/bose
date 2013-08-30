bose Slider
===========

###bose.slider.js
####Bose - jQuery DIV background Slider

Slider doesn't require any css. Controls in below is completely external and slider can suite into any container and image will auto fit! Good luck.

Usage
-----
```javascript
<script src="bose.slider.min.js">
```

```javascript
$("selector").bose({
	images : [ "imagePath_1", "imagePath_2", "imagePath_3"]
});
```	



###External Controls

```javascript
$('.play').click(function(){
	$(".bose").bose('play');
});

$('.pause').click(function(){
	$(".bose").bose('pause');
});

$('.previous').click(function(){
	$(".bose").bose('previous');
});

$('.next').click(function(){
	$(".bose").bose('next');
});
```	

###Options:

```javascript
images       : [ "http://lorempixel.com/960/500/sports", "http://lorempixel.com/960/500/fashion", "http://lorempixel.com/960/500/nature"],
imageTitles  : [
	['Title 1', 'Description one here'],
	['Title 2', 'Description two here'],
	['Title 3', 'Description three here']
],
wrapClass    : '',
sliderClass  : '',
holderClass  : '',
startIndex   : 0,
transition   : 'fade',
timeout      : 5, // 5 sec
duration     : 2, // 2 sec
pagination   : { show : boolean(true/false), container : selector, text : boolean(true/false) },
thumbs       : { show : boolean(true/false), container : selector, dimension : { width : 100, height: 60 }, text : boolean(true/false) },
onComplete   : function() {},
onSlideStart : function() {},
onSlideEnd   : function() {},
onPause      : function() {}
```
	
