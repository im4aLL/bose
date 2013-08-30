/**
 * [bose.slider.js]
 * @param  {[plugin]} $ [div background slider]
 * @author {[Hadi]}   [http://habibhadi.com]
 */
(function($) {

    /**
     * [default and global variables]
     * @type {String and Object}
     */
    var prefix          = 'bose',
    wrapClass           = prefix + '-wrapper',
    sliderClass         = prefix + '-slider',
    holderClass         = prefix + '-holder',
    settings            = {},
    currentImageIndex   = 0,
    prevImgIndex        = 0,
    objWH               = {},
    wWidth              = $(window).width(),
    wHeight             = $(window).height(),
    sliding             = null,
    sliderStarted       = false,
    previousTriggered   = false;

    var methods = {
        init : function( options ) { 

            /**
             * [plugin hooks]
             * @type {String and Object}
             */
            settings = $.extend({
                images       : null,
                onComplete   : function() {},
                onSlideStart : function() {},
                onSlideEnd   : function() {},
                wrapClass    : wrapClass,
                sliderClass  : sliderClass,
                holderClass  : holderClass,
                startIndex   : 0,
                transition   : 'fade',
                timeout      : 5,
                duration     : 2
            }, options);

            this.each(function(index, el) {

                // getting height and width of selector
                objWH = getWidthHeight(this);

                // adding class and wrapper
                $(this).addClass(settings.sliderClass).wrap('<div class="'+settings.wrapClass+'" />');
                
                // adding image holder
                $('.'+settings.wrapClass).prepend('<div class="' +settings.holderClass+ '"></div>');

                // adding container width height to slider
                $('.'+settings.wrapClass).children('.'+settings.holderClass).css({ width : objWH.width +'px', height : objWH.height +'px' });

                // start trigger
                //$.fn.bose('play');
                $(this).bose('play');

                // callback
                if ( settings.onComplete ) settings.onComplete.call( this );

            });

            // allow chain
            return this;

        },
        play : function() {
            showImage(currentImageIndex++);
        
            sliding = setInterval(function(){
                sliderStarted = true;
                nextTrigger();

            }, settings.timeout * 1000);
        },
        pause : function(){
            clearInterval(sliding);
        },
        next : function(){
            clearInterval(sliding);
            nextTrigger();
        },
        previous : function(){
            clearInterval(sliding);
            prevTrigger();
        }
    };

    $.fn.bose = function( method ) {

        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.boseSlider' );
        } 
        
    }

    /**
     * [getWidthHeight - grab width and height of an element]
     * @param  {[object]} elem [div id or class]
     * @return {[object]}      [width and height information]
     */
    function getWidthHeight( elem ){
        return container = { width : $(elem).width(), height : $(elem).height() };
    }

    /**
     * [preloadImages - allow preload images]
     * @param  {[array]} imageArray [one dimentional array]
     * @return {[null]}            [adding image to browser cache]
     */
    $.fn.bose.preloadImages = function(imageArray) {
        var preloaderArea = prefix + '-hiddenImages';
        $('body').append('<div id="'+preloaderArea+'" style="display:none"></div>');
        
        for(var i = 0; i < imageArray.length; i++) {
            $('<img />').attr({ src: imageArray[i], alt: '' }).appendTo('#'+preloaderAreaMain).hide();
        }
    }

    /**
     * [fitImg - fit image to container]
     * @param  {[object]} img [cached image var]
     * @return {[string]}     [return image style]
     */
    function fitImg(img){
        var scaledWidth  = (img.width * objWH.height) / img.height;
        var scaledHeight = (img.height * objWH.width) / img.width;

        if( scaledWidth < objWH.width &&  scaledHeight > objWH.height ){
            var calculatedPosition = (scaledHeight - objWH.height)/2;
            if(calculatedPosition<0) calculatedPosition = 0;
            return 'width:'+objWH.width+'px; top:-'+calculatedPosition+'px';
        }
        else if( scaledWidth > objWH.width &&  scaledHeight < objWH.height ) {
            var calculatedPosition = (scaledWidth - objWH.width)/2;
            if(calculatedPosition<0) calculatedPosition = 0;
            return 'height:'+objWH.height+'px; left:-'+calculatedPosition+'px';
        }
        else return 'height:'+objWH.height+'px; width:'+objWH.width+'px;';

    }

    /**
     * [showImage - showing image by current image array index]
     * @param  {[number]} currentImageIndex [image array index]
     * @return {[null]}                   [slide]
     */
    function showImage(currentImageIndex){

        var img    = new Image();
        img.src    = settings.images[currentImageIndex];
        img.onload = function() {
            if(sliderStarted === true){

                switch(settings.transition){
                    case 'fade':
                        
                        $('.'+settings.holderClass).append('<img class="'+prefix+'-image-'+currentImageIndex+'" src="'+settings.images[currentImageIndex]+'" style="'+fitImg(img)+'">');

                        if ( settings.onSlideStart ) settings.onSlideStart.call( this, prevImgIndex );
                        var prevImg = $('.'+settings.holderClass).children('.'+prefix+'-image-'+prevImgIndex);
                        prevImg.stop().animate({
                            opacity: 0},
                            settings.duration * 1000, function() {
                                prevImg.remove();
                        });

                        var curImg = $('.'+settings.holderClass).children('.'+prefix+'-image-'+currentImageIndex);
                        curImg.css({ opacity:0 });
                        curImg.stop().animate({
                            opacity: 1},
                            settings.duration * 1000, function() {
                                if ( settings.onSlideEnd ) settings.onSlideEnd.call( this, currentImageIndex );
                        });

                    break;
                }

            }
            else {
                switch(settings.transition){
                    case 'fade':
                    $('.'+settings.holderClass).append('<img class="'+prefix+'-image-'+currentImageIndex+'" src="'+settings.images[currentImageIndex]+'" style="'+fitImg(img)+'">');
                    var curImg = $('.'+settings.holderClass).children('.'+prefix+'-image-'+currentImageIndex);
                    curImg.css({ opacity:0 });
                    curImg.animate({
                        opacity: 1},
                        settings.duration * 1000, function() {
                            if ( settings.onSlideEnd ) settings.onSlideEnd.call( this, currentImageIndex );
                    });
                    break;
                }
            }
        };
    }

    /**
     * [nextTrigger Slider next]
     * @return {[null]} [add previous and current image index and transfer to showImage for next]
     */
    function nextTrigger(){
        if(previousTriggered){
            prevImgIndex = currentImageIndex + 1;
            currentImageIndex = currentImageIndex + 2;
            previousTriggered = false;
        }
        else {
            prevImgIndex = currentImageIndex-1;
            if(prevImgIndex<0) prevImgIndex = settings.images.length - 1;
        }

        if(currentImageIndex > (settings.images.length - 1)) currentImageIndex = 0;

        showImage(currentImageIndex++);
    }
    
    /**
     * [nextTrigger Slider prev]
     * @return {[null]} [add previous and current image index and transfer to showImage for prev]
     */
    function prevTrigger(){
        if(!previousTriggered){
            prevImgIndex = currentImageIndex - 1;
            currentImageIndex = currentImageIndex - 2;
            if(currentImageIndex < 0) currentImageIndex = settings.images.length - 1;
        }
        else {
            prevImgIndex = currentImageIndex+1;
            if(prevImgIndex>(settings.images.length - 1)) prevImgIndex = 0;
            else if(prevImgIndex<0) prevImgIndex = settings.images.length - 1;

            if(currentImageIndex > (settings.images.length - 1)) currentImageIndex = 0;
            else if(currentImageIndex < 0) currentImageIndex = settings.images.length - 1;
        }

        showImage(currentImageIndex--);
        previousTriggered = true;
    }

}(jQuery));