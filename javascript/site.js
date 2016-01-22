if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

            var stats;


            var fontLoaded = $.Deferred();

            var camera, controls, scene, renderer;

            // $(init);

            function init_example() {

                scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

                renderer = new THREE.WebGLRenderer();
                renderer.setClearColor( scene.fog.color );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );

                var $container = $('#container');
                var container = $container.get(0);
                container.appendChild( renderer.domElement );

                camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
                camera.position.z = 500;

                controls = new THREE.OrbitControls( camera, renderer.domElement );
                //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.enableZoom = false;

                // world

                var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
                var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );

                for ( var i = 0; i < 500; i ++ ) {

                    var mesh = new THREE.Mesh( geometry, material );
                    mesh.position.x = ( Math.random() - 0.5 ) * 1000;
                    mesh.position.y = ( Math.random() - 0.5 ) * 1000;
                    mesh.position.z = ( Math.random() - 0.5 ) * 1000;
                    mesh.updateMatrix();
                    mesh.matrixAutoUpdate = false;
                    scene.add( mesh );

                }

                // lights

                light = new THREE.DirectionalLight( 0xffffff );
                light.position.set( 1, 1, 1 );
                scene.add( light );

                light = new THREE.DirectionalLight( 0x002288 );
                light.position.set( -1, -1, -1 );
                scene.add( light );

                light = new THREE.AmbientLight( 0x222222 );
                scene.add( light );

                //

                stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.top = '0px';
                stats.domElement.style.zIndex = 100;
                container.appendChild( stats.domElement );

                //

                window.addEventListener( 'resize', onWindowResize, false );


                animate();
            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

            function animate() {

                requestAnimationFrame( animate );

                controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

                stats.update();

                render();

            }

            function render() {

                renderer.render( scene, camera );

            }




var canvas,
	$canvas,
	ctx,
	fontLoaded = $.Deferred(),
	canvasLoaded = $.Deferred();



var camera, controls, scene, renderer;


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
    const width = window.innerWidth;
	const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    $canvas.css({
    	width: width + 'px',
    	height: height + 'px'
    });

    if (camera) {
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
    }

    if (renderer)
        renderer.setSize( canvas.width, canvas.height );


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
    mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);

    //find which shape was clicked
    if (control.hitTest(mouseX, mouseY)) {
        controls.enabled = true;
    // alert('Mouse Up!')
        // dragging = true;

        // //We will pay attention to the point on the object where the mouse is "holding" the object:
        // dragHoldX = mouseX - control.x;
        // dragHoldY = mouseY - control.y;

        // targetX = mouseX - dragHoldX;
        // targetY = mouseY - dragHoldY;
            
        // //start timer
        // timer = setInterval(onTimerTick, 1000/30);
    }

    // if (dragging) {
    //     window.addEventListener("mousemove", mouseMoveListener, false);
    // }

    canvas.removeEventListener("mousedown", mouseDownListener, false);
    canvas.addEventListener("mouseup", mouseUpListener, false);
        
    //code below prevents the mouse down from having an effect on the main browser window:
    if (evt.preventDefault) {
        evt.preventDefault();
    } //standard
    else if (evt.returnValue) {
        evt.returnValue = false;
    } //older IE
    return false;
}

// function onTimerTick() {
    
//     Because of reordering, the dragging shape is the last one in the array.
//     The code below moves this shape only a portion of the distance towards the current "target" position, and 
//     because this code is being executed inside a function called by a timer, the object will continue to
//     move closer and closer to the target position.
//     The amount to move towards the target position is set in the parameter 'easeAmount', which should range between
//     0 and 1. The target position is set by the mouse position as it is dragging.        
    
//     control.x = control.x + easeAmount*(targetX - control.x);
//     control.y = control.y + easeAmount*(targetY - control.y);
    
//     //stop the timer when the target position is reached (close enough)
//     if ((!dragging) && (Math.abs(control.x - targetX) < 0.1) && (Math.abs(control.y - targetY) < 0.1)) {
//         control.x = targetX;
//         control.y = targetY;
//         //stop timer:
//         clearInterval(timer);
//     }

//     drawScene();
// }


function mouseUpListener(evt) {
    // alert('Mouse Up!')
    canvas.addEventListener("mousedown", mouseDownListener, false);
    canvas.removeEventListener("mouseup", mouseUpListener, false);
    controls.enabled = false;
    // if (dragging) {
    //     dragging = false;
    //     window.removeEventListener("mousemove", mouseMoveListener, false);
    // }
}

// function mouseMoveListener(evt) {
//     var posX;
//     // var posY;
//     var rad = control.radius;

//     //Control can move around in the middle half of the canvas
//     var minX = canvas.width / 4 + rad;
//     var maxX = (canvas.width * 3 / 4) - rad;
//     // var minY = rad;
//     // var maxY = canvas.height - rad;
//     //getting mouse position correctly 
//     var bRect = canvas.getBoundingClientRect();
//     mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
//     // mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
    
//     //clamp x and y positions to prevent object from dragging outside of canvas
//     posX = mouseX - dragHoldX;
//     posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
//     // posY = mouseY - dragHoldY;
//     // posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

//     targetX = posX;
//     // targetY = posY;
    
//     // drawScene();
// }

function drawText() {
	ctx.font = "100 132px Raleway";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("BLISS ON TAP", canvas.width/2, canvas.height/3)
}



function makeScene() {
    control = new Control(canvas.width / 2, canvas.height / 10);

                scene = new THREE.Scene();
                // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

                renderer = new THREE.CanvasRenderer({ canvas: canvas });
                renderer.setClearColor( '#9DE0AD' );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );

                // var $container = $('#container');
                // var container = $container.get(0);
                // container.appendChild( renderer.domElement );

                camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
                camera.position.z = 500;

                controls = new THREE.OrbitControls( camera, renderer.domElement );
                //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
                controls.enabled = false;
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.enableZoom = false;
                controls.enablePan = false;
                controls.enableKeys = false;
                controls.maxPolarAngle = Math.PI / 2;
                controls.minPolarAngle = Math.PI / 2;
                controls.minAzimuthAngle = -Math.PI / 8;
                controls.maxAzimuthAngle = Math.PI / 8;

                // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].

                // world

                var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
                var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );

                for ( var i = 0; i < 500; i ++ ) {

                    var mesh = new THREE.Mesh( geometry, material );
                    mesh.position.x = ( Math.random() - 0.5 ) * 1000;
                    mesh.position.y = ( Math.random() - 0.5 ) * 1000;
                    mesh.position.z = ( Math.random() - 0.5 ) * 1000;
                    mesh.updateMatrix();
                    mesh.matrixAutoUpdate = false;
                    scene.add( mesh );

                }

                // lights

                light = new THREE.DirectionalLight( 0xffffff );
                light.position.set( 1, 1, 1 );
                scene.add( light );

                light = new THREE.DirectionalLight( 0x002288 );
                light.position.set( -1, -1, -1 );
                scene.add( light );

                light = new THREE.AmbientLight( 0x222222 );
                scene.add( light );

                //

                stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.top = '0px';
                stats.domElement.style.zIndex = 100;
                $('body').append( stats.domElement );

                //

                // window.addEventListener( 'resize', onWindowResize, false );

    setupBackgrounds();

	render();

}




function render() {
    requestAnimationFrame( render );

    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true       

    stats.update();
    ctx.fillStyle = "#9DE0AD";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    renderer.render( scene, camera );
    drawScene();
}



function drawScene() {
    //bg
    control.drawToContext(ctx);

    drawText();

    for (var i = 0; i < backgrounds.length; i++) {
        for (var j = 0; j < backgrounds[i].Positions.length; j++) {
            // drawBackground(backgrounds[i], backgrounds[i].Positions[j]);
        }
    }
}


function setupThreeJsControls() {

}




//Backgrounds area scaled assuming a 1000 by 1000 px area
function setupBackgrounds() {
	var BackgroundList = [
	{
		positions: [new Point3D(0, 0, 0)],
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
		positions: [new Point3D(0, 0, 0)],
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
		positions: [new Point3D(0, 0, 0)],
		sprite: [
			new Point(0 - 500, 1000),
			new Point(500, 500),
			new Point(700, 700),
			new Point(850, 650),
			new Point(1500, 1000)
		],
		color: new RGBA(69,173,168, 1)
	},


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
    ];

    for (var i = 0; i < BackgroundList.length; i++) {
        var background = createBackground(BackgroundList[i]);
        backgrounds.push(background);
    }
}

function createBackground(background) {
    return new Background(background.positions,new Sprite(background.sprite),background.color);
}


function Background(pos, sprite, color) {
    // this.ThreeObject = obj || MasterObject;
    this.Positions = pos || [new Point];
    this.Sprite = sprite || new Sprite;
    this.Color = color || new RGBA(Math.round(255 * Math.random()),Math.round(255 * Math.random()),Math.round(255 * Math.random()),1);
}



function drawBackground(background, startPos) {
    var points = background.Sprite.Points;
    var startX = startPos.x;
    var startY = startPos.y;

    ctx.beginPath();

    //Scale from 1000 x 1000 px to canvas size (but keep aspect ratio)
    //but we will make 500, 500 == the middle of the canvas.
    var scale;
    var offset;

    if (canvas.width > canvas.height) {
        scale = new Point(canvas.width / 1000, canvas.width / 1000);
        offset = new Point(0, -(canvas.width - canvas.height) / 2);
    }
    else {
        scale = new Point(canvas.height / 1000, canvas.height / 1000);
        offset = new Point(-(canvas.height - canvas.width) / 2, 0);
    }

    ctx.moveTo(startX + offset.x + points[0].x * scale.x, startY + offset.y + points[0].y * scale.y);

    for (var a = 1; a < points.length; a++) {
        ctx.lineTo(startX + offset.x + points[a].x * scale.x, startY + offset.y + points[a].y * scale.y);
    }

    ctx.lineTo(startX + offset.x + 1500 * scale.x, startY + offset.y + 1500 * scale.y);
    ctx.lineTo(startX - offset.x + 1500 * scale.x, startY + offset.y + 1500 * scale.y);

    ctx.closePath();

    ctx.fillStyle = background.Color.toString();

    ctx.fill();
}