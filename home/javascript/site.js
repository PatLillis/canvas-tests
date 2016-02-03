var font = 'Cantarell';
var fontUrl = font.replace(' ', '+');

var colors = ['#34b3a0', '#23364A', '#8F1C64', '#CA2C71', '#DC3651', '#EE4030'];

function getColor() {
    var idx = Math.floor((Math.random() * colors.length));
    return colors[idx];
}

function init() {
    //jQuery time
    var parent, ink, d, x, y;
    $("body").click(function(e) {
        parent = $('body');

        if (!parent.hasClass('sound-ready') || parent.hasClass('playing'))
            return;

        //create .ink element if it doesn't exist
        if (parent.find(".ink").length == 0)
            parent.prepend("<span class='ink'></span>");

        ink = parent.find(".ink");
        //incase of quick double clicks stop the previous animation
        ink.removeClass("animate");

        //set size of .ink
        if (!ink.height() && !ink.width()) {
            //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({
                height: d,
                width: d
            });
        }

        //get click coordinates
        //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
        x = e.pageX - parent.offset().left - ink.width() / 2;
        y = e.pageY - parent.offset().top - ink.height() / 2;

        var color = getColor();

        //set the position and add class .animate
        ink.css({
            top: y + 'px',
            left: x + 'px',
            background: color,
            transform: 'scale(2.5)'
        });
    });

    //Re-size ink circle
    $(window).on('resize', function() {
        parent = $('body');
        d = Math.max(parent.outerWidth(), parent.outerHeight());
        ink.css({
            height: d,
            width: d
        });
    });


    // initialize the sound manager 
    soundManager.url = 'soundManager2/';
    soundManager.useHTML5Audio = true;
    soundManager.preferFlash = false;
    soundManager.useHighPerformance = true; // reduces delays 

    // reduce the default 1 sec delay to 500 ms 
    soundManager.flashLoadTimeout = 500;

    // mp3 is required by default, but we don't want any requirements 
    soundManager.audioFormats.mp3.required = false;

    soundManager.onready(function() {
        // ok to show the button to run the sound sample 
        $('body').addClass('sound-ready');
    });


    var soundNames = ['aisatsana_01'],
        loader = new PxLoader(),
        i, len, url;

    // queue each sound for loading 
    for (i = 0, len = soundNames.length; i < len; i++) {

        // see if the browser can play m4a 
        url = 'audio/' + soundNames[i] + '.mp3';

        // queue the sound using the name as the SM2 id 
        loader.addSound(soundNames[i], url);
    }

    // listen to load events 
    loader.addProgressListener(function(e) {

        // show the icon once a sound has loaded 
        var soundId = e.resource.sound.sID;
        // $icon = $('#' + soundId).addClass('ready');

        // play the sound when the icon is clicked 
        $("body").click(function() {

            if (!parent.hasClass('sound-ready') || parent.hasClass('playing'))
                return;

            // highlight the icon while playing 
            $('body').addClass('playing');

            soundManager.play(soundId, {
                onfinish: function() {
                    $('.ink').css({
                        opacity: 0
                    });

                    var color = $('.ink').css('background-color');

                    parent.css({
                        'border-color': color
                    });

                    setTimeout(function() {
                        $('.ink').addClass('notransition'); // Disable transitions
                        $('.ink').css({
                            opacity: 1,
                            transform: 'scale(0)'
                        });
                        $('.ink')[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
                        $('.ink').removeClass('notransition'); // Re-enable transitions

                        $('body').removeClass('playing');
                    }, 300);
                }
            });
        });
    });

    loader.start();
}
