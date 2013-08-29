(function($) {

    // default settings
    var prefix        = 'bose',
    wrapClass         = prefix + '-wrapper',
    sliderClass       = prefix + '-slider',
    holderClass       = prefix + '-holder',
    settings          = {},
    currentImageIndex = 0,
    objWH             = {},
    wWidth            = $(window).width(),
    wHeight           = $(window).height(),
    sliding           = null,
    sliderStarted     = false;

    $.fn.bose = function( options ) {

        // plugin params
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

            $('.'+settings.wrapClass).children('.'+settings.holderClass)
            .css({ width : objWH.width +'px', height : objWH.height +'px' });

            play();

            // callback
        	if ( settings.onComplete ) settings.onComplete.call( this );

        });

        // allow chain
        return this;
    }

    function getWidthHeight( elem ){
        return container = { width : $(elem).width(), height : $(elem).height() };
    }

    function preload_images(imageArray) {
        var preloaderArea = prefix + '-hiddenImages';
        $('body').append('<div id="'+preloaderArea+'" style="display:none"></div>');
        
        for(var i = 0; i < imageArray.length; i++) {
            $('<img />').attr({ src: imageArray[i], alt: '' }).appendTo('#'+preloaderAreaMain).hide();
        }
    }

    function fitImg(img){
        var scaledWidth = (img.width * objWH.height) / img.height;
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

    function showImage(currentImageIndex){
        var img = new Image();
        img.src = settings.images[currentImageIndex];
        img.onload = function() {
            if(sliderStarted === true){

                switch(settings.transition){
                    case 'fade':
                        
                        $('.'+settings.holderClass).append('<img class="'+prefix+'-image-'+currentImageIndex+'" src="'+settings.images[currentImageIndex]+'" style="'+fitImg(img)+'">');

                        var prevImgIndex = currentImageIndex-1;
                        if(prevImgIndex<0) prevImgIndex = settings.images.length - 1;

                        if ( settings.onSlideStart ) settings.onSlideStart.call( this, prevImgIndex );

                        var prevImg = $('.'+settings.holderClass).children('.'+prefix+'-image-'+prevImgIndex);
                        prevImg.animate({
                            opacity: 0},
                            settings.duration * 1000, function() {
                                prevImg.remove();
                        });

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


    function play(){
        showImage(currentImageIndex++);
        
        sliding = setInterval(function(){
            sliderStarted = true;

            if(currentImageIndex > (settings.images.length - 1)) currentImageIndex = 0;
            showImage(currentImageIndex++);

        }, settings.timeout * 1000);
    }

    

}(jQuery));