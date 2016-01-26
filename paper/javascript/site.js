var canvas,
    $canvas,
    ctx,
    fontLoaded = $.Deferred(),
    canvasLoaded = $.Deferred();

var stats;

var font = 'Cantarell';
var fontUrl = font.replace(' ', '+');

function init() {
    $canvas = $("#cnvs");
    canvas = $canvas.get(0);
    ctx = canvas.getContext("2d");

    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

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
$.when(fontLoaded, canvasLoaded).done(init_canvas);


function init_canvas() {
    var img = new Image();
    img.onload = function () {
        drawImgShape(sprites[0], img, new Color(255, 0, 0));
    }
    img.src = "images/crumpled_white_paper_texture_by_melemel.jpg";   
}

function drawImgShape(sprite, img, color) {
    ctx.save();    /// store current state of canvas incl. default clip mask

    var max = new Point(sprite.Points[0].x, sprite.Points[0].y);
        min = new Point(sprite.Points[0].x, sprite.Points[0].y);

    ctx.beginPath();
    ctx.moveTo(sprite.Points[0].x, sprite.Points[0].y);

    for (var i = 1; i < sprite.Points.length; i++) {
        var p = sprite.Points[i];
        max.x = Math.max(max.x, p.x);
        max.y = Math.max(max.y, p.y);
        min.x = Math.min(min.x, p.x);
        min.y = Math.min(min.y, p.y);

        ctx.lineTo(p.x, p.y);
    }

    ctx.lineTo(sprite.Points[0].x, sprite.Points[0].y);
    ctx.clip();    /// will close the path implicit

    /// draw graphics here
    var spriteWidth = max.x - min.x,
        spriteHeight = max.y - min.y;

    ctx.drawImage(img, 0, 0, img.width, img.height, min.x, min.y, spriteWidth, spriteHeight);

    if (color) {
        ctx.globalCompositeOperation = 'color-burn';
        ctx.fillStyle = color.toString();
        ctx.rect(min.x, min.y, spriteWidth, spriteHeight);
        ctx.fill();
    }

    ctx.restore(); /// restore default infinite clipping mask
}

var sprites = [
    new Sprite([
        new Point(505, 150),
        new Point(750, 5),
        new Point(150, 150)
    ])
];
