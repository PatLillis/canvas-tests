var canvas,
    $canvas,
    ctx,
    fontLoaded = $.Deferred(),
    canvasLoaded = $.Deferred();

var control;
var easeAmount = 0.05;

var dragging;
var mouseX;
var mouseY;
var dragHoldX;
var backgrounds = [];
var stats;

var font = 'Cantarell';
var fontUrl = font.replace(' ', '+');

function init() {
    $canvas = $("#cnvs");
    canvas = $canvas.get(0);
    ctx = canvas.getContext("2d");

    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    // $('body').append( stats.domElement );

    metrics();

    canvasLoaded.resolve();
}

//Re-size
function metrics() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    $canvas.css({
        width: width + 'px',
        height: height + 'px'
    });
    console.log("width: " + width);
    console.log("height: " + height);
}

//Can't draw until both canvas and fonts are loaded.
$.when(fontLoaded, canvasLoaded).done(init_text);


/* 
original script by Rishabh
additions by Rezoner: blur, pulsation, quality, blinking, arc/rect, trembling, background adjusting
*/

/* play with these values */

BLUR = true;

PULSATION = true;
PULSATION_PERIOD = 1000;
PARTICLE_RADIUS = 2;

/* disable blur before using blink */
BLINK = false;

GLOBAL_PULSATION = false;

QUALITY = 2; /* 0 - 5 */

/* set false if you prefer rectangles */
ARC = false;

/* trembling + blur = fun */
TREMBLING = 0; /* 0 - infinity */

FANCY_FONT = font;

BACKGROUND = "#001";

BLENDING = true;

/* if empty the text will be a random number */
TEXT = "LIGHTWORKER";

/* ------------------ */


QUALITY_TO_FONT_SIZE = [10, 20, 30, 100, 200, 350];
QUALITY_TO_SCALE = [20, 14, 6, 3, 1.5, 0.9];
QUALITY_TO_TEXT_POS = [10, 18, 43, 86, 170, 280];

var color_refresh = 0.3;


var paletteIndex = 0;

var dream_magnet = [
    { color: new RGBA(52,56,56), weight: 5 },
    { color: new RGBA(0,95,107), weight: 4 },
    { color: new RGBA(0,140,158), weight: 4 },
    { color: new RGBA(0,180,204), weight: 4 },
    { color: new RGBA(0,223,252), weight: 59 }
];

var sex_n_roll = [
    { color: new RGBA(28,1,19), weight: 55 },
    { color: new RGBA(107,1,3), weight: 4 },
    { color: new RGBA(163,0,6), weight: 4 },
    { color: new RGBA(194,26,1), weight: 4 },
    { color: new RGBA(240,60,2), weight: 59 }
];

// var palettes = [dream_magnet];
var palettes = [sex_n_roll];

function init_text() {
    document.body.style.backgroundColor = BACKGROUND;

    var canvas = document.getElementById("cnvs");
    var ctx = canvas.getContext("2d");

    var W = canvas.width;
    var H = canvas.height;

    var tcanvas = document.createElement("canvas");
    var tctx = tcanvas.getContext("2d");
    tcanvas.width = W;
    tcanvas.height = H;


    var positions = [];

    function new_positions() {
        tctx.fillStyle = "white";
        tctx.fillRect(0, 0, W, H)
        tctx.fill();

        tctx.font = "bold " + QUALITY_TO_FONT_SIZE[QUALITY] + "px " + FANCY_FONT;
        var text = TEXT || String(Math.random()).substr(-3);

        tctx.strokeStyle = "black";
        tctx.fillStyle = "black";
        tctx.fillText(text, (QUALITY + 1) * 5, QUALITY_TO_TEXT_POS[QUALITY]);

        image_data = tctx.getImageData(0, 0, W, H);
        pixels = image_data.data;
        positions = [];
        for (var i = 0; i < pixels.length; i = i + 4) {
            if (pixels[i] != 255) {
                position = {
                    x: (i / 4 % W | 0) * QUALITY_TO_SCALE[QUALITY] | 0,
                    y: (i / 4 / W | 0) * QUALITY_TO_SCALE[QUALITY] | 0
                }
                positions.push(position);
            }
        }

        console.log('positions: ', positions.length);
    }

    new_positions();


    total_area = W * H;
    total_particles = positions.length;
    single_particle_area = total_area / total_particles;
    area_length = Math.sqrt(single_particle_area);
    console.log(area_length);

    var particles = [];
    for (var i = 1; i <= total_particles; i++) {
        particles.push(new particle(i));
    }

    get_colors(true);

    console.log('particles: ', particles.length);




    get_destinations();

    function particle(i) {
        this.x = (i * area_length) % W;
        this.y = (i * area_length) / W * area_length;


        /* randomize delta to make particles sparkling */
        this.deltaOffset = Math.random() * PULSATION_PERIOD | 0;

        this.radius = 0.1 + Math.random() * 2;
    }


    function getColor(palette) {
        var totalWeight = 0;
        for (var i = 0; i < palette.length; i++)
            totalWeight += palette[i].weight;

        var rand = Math.floor(Math.random()* (totalWeight + 1));

        for (var i = 0; i < palette.length; i++) {
            rand -= palette[i].weight;
            if (rand <= 0) return palette[i].color;
        }
    }



    function draw() {

        stats.update();

        var now = Date.now();

        ctx.globalCompositeOperation = "source-over";

        if (BLUR) ctx.globalAlpha = 0.1;
        else if (!BLUR && !BLINK) ctx.globalAlpha = 1.0;

        ctx.fillStyle = BACKGROUND;
        ctx.fillRect(0, 0, W, H)

        if (BLENDING) ctx.globalCompositeOperation = "lighter";

        for (var i = 0; i < particles.length; i++) {
            p = particles[i];

            /* in lower qualities there is not enough full pixels for all of  them - dirty hack*/

            if (isNaN(p.x)) continue

            ctx.beginPath();
            //ctx.fillStyle = "rgb(" + p.r + ", " + p.g + ", " + p.b + ")";
            //ctx.fillStyle = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.alpha + ")";
            ctx.fillStyle = p.color.toString();


            if (BLINK) ctx.globalAlpha = Math.sin(Math.PI * mod * 1.0);

            if (PULSATION) { /* this would be 0 -> 1 */
                var mod = ((GLOBAL_PULSATION ? 0 : p.deltaOffset) + now) % PULSATION_PERIOD / PULSATION_PERIOD;

                /* lets make the value bouncing with sinus */
                mod = Math.sin(mod * Math.PI);
            } else var mod = 1;

            var offset = TREMBLING ? TREMBLING * (-1 + Math.random() * 2) : 0;

            var radius = PARTICLE_RADIUS * p.radius;

            if (!ARC) {
                ctx.fillRect(offset + p.x - mod * radius / 2 | 0, offset + p.y - mod * radius / 2 | 0, radius * mod, radius * mod);
            } else {
                ctx.arc(offset + p.x | 0, offset + p.y | 0, radius * mod, Math.PI * 2, false);
                ctx.fill();
            }
        }
        
        requestAnimationFrame(draw);
    }

    function get_colors(force_color) {
        var palette = palettes[paletteIndex++];
        paletteIndex = paletteIndex % palettes.length;


        for (var i = 0; i < particles.length; i++) {
            if (force_color || Math.random() < color_refresh)
                particles[i].color = getColor(palette);
        }
    }

    function get_destinations() {
        for (var i = 0; i < particles.length; i++) {
            pa = particles[i];
            particles[i].alpha = 1;
            var distance = [];

            if (positions.length > i) {
                var position = positions[i];
                pa.x = positions[i].x;
                pa.y = positions[i].y;
            }
            else {
                particles.splice(i);
            }
        }
    }

    new_positions();
    // setInterval(draw, 16.67);
    draw();
    // setInterval(new_positions, 2000);
    setInterval(get_colors, 500);
}
