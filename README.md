bose
====

A div background slider using jQuery

Usage
-----
 ```javascript
$(".bose").bose({
	images : [ "http://lorempixel.com/960/500/sports", "http://lorempixel.com/960/500/fashion", "http://lorempixel.com/960/500/nature"],
	onComplete : function(){ 
		console.log("Trigger onComplete!"); 
	},
	onSlideStart : function(index){
		console.log(index + ' destroying'); 
	},
	onSlideEnd : function(index){ 
		console.log(index + ' showed'); 
	}
});
```