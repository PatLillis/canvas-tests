"use strict";

var canvas,
    $canvas,
    ctx,
    fontLoaded = $.Deferred(),
    canvasLoaded = $.Deferred();

var dragIndex;
var dragging;
var mouseX;
var mouseY;
var dragHoldX;
var dragHoldY;
var backgrounds = [];

// $(init);

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

function metrics() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    $canvas.css({
        width: width + 'px',
        height: height + 'px'
    });
    console.log("width: " + width);
    console.log("height: " + height);
}

$.when(fontLoaded, canvasLoaded).done(makeScene);

var control;
var timer;
var easeAmount = 0.2;

//We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
//only the topmost one will be dragged.
function mouseDownListener(evt) {
    var highestIndex = -1;

    //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
    var bRect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left) * (canvas.width / bRect.width);
    mouseY = (evt.clientY - bRect.top) * (canvas.height / bRect.height);

    //find which shape was clicked
    if (control.hitTest(mouseX, mouseY)) {
        dragging = true;

        //We will pay attention to the point on the object where the mouse is "holding" the object:
        dragHoldX = mouseX - control.x;
        dragHoldY = mouseY - control.y;

        targetX = mouseX - dragHoldX;
        targetY = mouseY - dragHoldY;

        //start timer
        timer = setInterval(onTimerTick, 1000 / 30);
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
    /*
    Because of reordering, the dragging shape is the last one in the array.
    The code below moves this shape only a portion of the distance towards the current "target" position, and 
    because this code is being executed inside a function called by a timer, the object will continue to
    move closer and closer to the target position.
    The amount to move towards the target position is set in the parameter 'easeAmount', which should range between
    0 and 1. The target position is set by the mouse position as it is dragging.        
    */
    control.x = control.x + easeAmount * (targetX - control.x);
    control.y = control.y + easeAmount * (targetY - control.y);

    //stop the timer when the target position is reached (close enough)
    if (!dragging && Math.abs(control.x - targetX) < 0.1 && Math.abs(control.y - targetY) < 0.1) {
        control.x = targetX;
        control.y = targetY;
        //stop timer:
        clearInterval(timer);
    }

    drawScene();
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
    // var posY;
    var rad = control.radius;

    //Control can move around in the middle half of the canvas
    var minX = canvas.width / 4 + rad;
    var maxX = canvas.width * 3 / 4 - rad;
    // var minY = rad;
    // var maxY = canvas.height - rad;
    //getting mouse position correctly
    var bRect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left) * (canvas.width / bRect.width);
    // mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);

    //clamp x and y positions to prevent object from dragging outside of canvas
    posX = mouseX - dragHoldX;
    posX = posX < minX ? minX : posX > maxX ? maxX : posX;
    // posY = mouseY - dragHoldY;
    // posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

    targetX = posX;
    // targetY = posY;

    // drawScene();
}

function drawText() {
    ctx.font = "100 132px Raleway";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("BLISS ON TAP", canvas.width / 2, canvas.height / 3);
}

function makeScene() {
    control = new Control(canvas.width / 2, canvas.height / 10);

    // var scene = new THREE.Scene();
    // camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
    // var renderer;

    // if (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    // renderer = new THREE.WebGLRenderer({ canvas: canvas });
    // else
    // renderer = new THREE.CanvasRenderer({ canvas: canvas });

    // renderer.setSize( canvas.width, canvas.height );

    // scene.add(camera);
    // /	scene.add(MasterObject);

    // camera.position.z = 25;

    function render() {
        requestAnimationFrame(render);
        // renderer.render( scene, camera );
        drawScene();
    }
    // render();

    setupBackgrounds();

    drawScene();
}

function drawScene() {
    //bg
    ctx.fillStyle = "#9DE0AD";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    control.drawToContext(ctx);

    drawText();

    for (var i = 0; i < backgrounds.length; i++) {
        for (var j = 0; j < backgrounds[i].Positions.length; j++) {
            drawBackground(backgrounds[i], backgrounds[i].Positions[j]);
        }
    }
}

//Backgrounds area scaled assuming a 1000 by 1000 px area
function setupBackgrounds() {
    var BackgroundList = [{
        positions: [new Point3D(0, 0, 0)],
        sprite: [new Point(0 - 500, 1000), new Point(550, 350), new Point(650, 450), new Point(750, 425), new Point(1500, 1000)],
        color: new RGBA(109, 199, 163, 1)
    }, {
        positions: [new Point3D(0, 0, 0)],
        sprite: [new Point(0 - 500, 1000), new Point(200, 300), new Point(500, 600), new Point(750, 500), new Point(1500, 1000)],
        color: new RGBA(89, 186, 165, 1)
    }, {
        positions: [new Point3D(0, 0, 0)],
        sprite: [new Point(0 - 500, 1000), new Point(500, 500), new Point(700, 700), new Point(850, 650), new Point(1500, 1000)],
        color: new RGBA(69, 173, 168, 1)
    }];

    // {
    //        positions: [new Point3D(40,8.5,-2)],
    //        sprite: [new Point(-500,1e3), new Point(-37,5), new Point(-30,-55), new Point(-15,-60), new Point(0,0), new Point(20,-20), new Point(40,3), new Point(46,40), new Point(300,1e3)],
    //        // color: landCols[1]
    //    },
    // {
    //     positions: [new Point3D(0,-1.5,-2), new Point3D(0,-14.5,-2)],
    //     sprite: [new Point(-1500,200), new Point(-1e3,0), new Point(-700,50), new Point(30,-90), new Point(200,0), new Point(390,-20), new Point(1100,100), new Point(1500,300)],
    //     // color: landCols[1]
    // },
    // {
    //     positions: [new Point3D(40,8.2,-5)],
    //     sprite: [new Point(-50,1e3), new Point(-45,30), new Point(-35,40), new Point(-15,-5), new Point(0,-40), new Point(45,-27), new Point(60,25), new Point(68,20), new Point(75,60), new Point(120,100), new Point(300,120), new Point(300,1e3)],
    //     // color: landCols[2]
    // },
    // {
    //     positions: [new Point3D(0,-1,-6), new Point3D(0,-14,-6)],
    //     sprite: [new Point(-1500,200), new Point(-1e3,0), new Point(-700,50), new Point(-100,-120), new Point(50,20), new Point(330,-20), new Point(1100,100), new Point(1500,300)],
    //     // color: landCols[2]
    // },
    // {
    //     positions: [new Point3D(0,-1,-12), new Point3D(0,-14,-12)],
    //     sprite: [new Point(-1500,200), new Point(-1e3,0), new Point(-700,30), new Point(20,-10), new Point(150,-50), new Point(350,-20), new Point(650,30), new Point(850,10), new Point(1500,300)],
    //     // color: landCols[3]
    // },
    // {
    //     positions: [new Point3D(0,-1,-18), new Point3D(0,-14,-18)],
    //     sprite: [new Point(-1500,200), new Point(-9e3,10), new Point(-700,50), new Point(-550,-20), new Point(-450,15), new Point(50,-100), new Point(90,-70), new Point(410,-15), new Point(550,-20), new Point(1100,100), new Point(1500,300)],
    //     // color: landCols[4]
    // }
    for (var i = 0; i < BackgroundList.length; i++) {
        var background = createBackground(BackgroundList[i]);
        backgrounds.push(background);
    }
}

function createBackground(background) {
    return new Background(background.positions, new Sprite(background.sprite), background.color);
}

function Background(pos, sprite, color) {
    // this.ThreeObject = obj || MasterObject;
    this.Positions = pos || [new Point()];
    this.Sprite = sprite || new Sprite();
    this.Color = color || new RGBA(Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random()), 1);
}

function drawBackground(background, startPos) {
    var points = background.Sprite.Points;
    var startX = startPos.x;
    var startY = startPos.y;

    ctx.beginPath();

    //Scale to 1000x1000px size
    var scale = new Point(canvas.width / 1000, canvas.height / 1000);

    ctx.moveTo(startX + points[0].x * scale.x, startY + points[0].y * scale.y);

    for (var a = 1; a < points.length; a++) {
        ctx.lineTo(startX + points[a].x * scale.x, startY + points[a].y * scale.y);
    }

    ctx.lineTo(startX + 1500 * scale.x, startY + 1500 * scale.y);
    ctx.lineTo(startX - 1500 * scale.x, startY + 1500 * scale.y);

    ctx.closePath();

    ctx.fillStyle = background.Color.toString();

    ctx.fill();
}
//# sourceMappingURL=site.js.map
