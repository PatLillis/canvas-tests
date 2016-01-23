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

function init() {
    $canvas = $("#cnvs");
    canvas = $canvas.get(0);
    ctx = canvas.getContext("2d");

    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    metrics();

    canvas.addEventListener("mousedown", mouseDownListener, false);

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
$.when(fontLoaded, canvasLoaded).done(makeScene);


function makeScene() {
    //Set up control
    control = new Control(canvas.width / 2, canvas.height / 10);

    //Set up backgrounds
    setupBackgrounds();

    //Draw once initially
    drawScene();
}

//We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
//only the topmost one will be dragged.
function mouseDownListener(evt) {

    //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
    var bRect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);

    //find which shape was clicked
    if (control.hitTest(mouseX, mouseY)) {
        dragging = true;

        //We will pay attention to the point on the object where the mouse is "holding" the object:
        dragHoldX = mouseX - control.x;

        targetX = mouseX - dragHoldX;
            
        //start timer
        requestAnimationFrame( onTimerTick );
    }

    if (dragging) {
        window.addEventListener("mousemove", mouseMoveListener, false);
    }

    canvas.removeEventListener("mousedown", mouseDownListener, false);
    window.addEventListener("mouseup", mouseUpListener, false);
        
    //code below prevents the mouse down from having an effect on the main browser window:
    if (evt.preventDefault) {
        evt.preventDefault();
    } //standard
    else if (evt.returnValue) {
        evt.returnValue = false;
    } //older IE
    return false;
}


function onTimerTick() {
    control.x = control.x + easeAmount*(targetX - control.x);

    drawScene();

    //stop the timer when the target position is reached (close enough)
    if ((!dragging) && (Math.abs(control.x - targetX) < 0.1)) {
            //do nothing
    }
    else {
        requestAnimationFrame( onTimerTick );
    }
}


function mouseUpListener(evt) {
    canvas.addEventListener("mousedown", mouseDownListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    if (dragging) {
        dragging = false;
        window.removeEventListener("mousemove", mouseMoveListener, false);
    }
}

function mouseMoveListener(evt) {
    var posX;

    //Control can move around in the middle quarter of the canvas
    var minX = (canvas.width * 2 / 8) + control.radius;
    var maxX = (canvas.width * 6 / 8) - control.radius;

    //getting mouse position correctly 
    var bRect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
    
    //clamp x and y positions to prevent object from dragging outside of canvas
    posX = mouseX - dragHoldX;
    posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);

    targetX = posX;
}

function drawText() {
    ctx.font = "100 132px Raleway";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("BLISS ON TAP", canvas.width/2, canvas.height/3)
}


function drawScene() {
    //bg
    ctx.fillStyle = "#9DE0AD";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    control.drawToContext(ctx);

    drawText();

    for (var i = 0; i < backgrounds.length; i++) {
        drawBackground(backgrounds[i]);
    }
}


//Backgrounds area scaled assuming a 1000 by 1000 px area
function setupBackgrounds() {
    var BackgroundList = [
    {
        speed: 0.2,
        sprite: [
            new Point(0 - 500, 1000),
            new Point(550, 350),
            new Point(650, 450),
            new Point(750, 425),
            new Point(1500, 1000)
        ],
        color: new RGBA(109, 199, 163, 1)
    },
    {
        speed: 0.3,
        sprite: [
            new Point(0 - 500, 1000),
            new Point(200, 300),
            new Point(500, 600),
            new Point(750, 500),
            new Point(1500, 1000)
        ],
        color: new RGBA(89,186,165, 1)
    },
    {
        speed: 0.4,
        sprite: [
            new Point(0 - 500, 1000),
            new Point(500, 500),
            new Point(700, 700),
            new Point(850, 650),
            new Point(1500, 1000)
        ],
        color: new RGBA(69,173,168, 1)
    },
    ];


    for (var i = 0; i < BackgroundList.length; i++) {
        var background = new Background( BackgroundList[i].speed, new Sprite(BackgroundList[i].sprite), BackgroundList[i].color);
        backgrounds.push(background);
    }
}


function drawBackground(background) {
    var points = background.Sprite.Points;

    //for parallaxing
    var offsetX = (control.x - (canvas.width / 2)) * background.Speed;

    ctx.beginPath();

    //Scale to 1000x1000px size
    var scale = new Point(canvas.width / 1000, canvas.height / 1000);

    ctx.moveTo(offsetX + points[0].x * scale.x, points[0].y * scale.y);

    for (var a = 1; a < points.length; a++) {
        ctx.lineTo(offsetX + points[a].x * scale.x, points[a].y * scale.y);
    }

    ctx.lineTo(offsetX + 1500 * scale.x, 1500 * scale.y);
    ctx.lineTo(offsetX + 1500 * scale.x, 1500 * scale.y);

    ctx.closePath();
    ctx.fillStyle = background.Color.toString();
    ctx.fill();
}