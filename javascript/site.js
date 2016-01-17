var canvas,
	$canvas,
	ctx,
	fontLoaded = $.Deferred(),
	canvasLoaded = $.Deferred();

// $(init);

function init() {
    $canvas = $("#cnvs");
    canvas = $canvas.get(0);
    ctx = canvas.getContext("2d");

    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    metrics();

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
    console.log("width: " + width);
    console.log("height: " + height);
}


$.when(fontLoaded, canvasLoaded).done(drawText, drawScene);

function drawText() {
	ctx.font = "100 106px Raleway";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	// ctx.fillText("HELLO WORLD", canvas.width/2, canvas.height/2)
}


function drawScene() {
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

	// function render() {
		// requestAnimationFrame( render );
		// renderer.render( scene, camera );
	// }
	// render();

	setupBackgrounds();
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
        for (var j = 0; j < background.Positions.length; j++) {
        	drawBackground(background, background.Positions[j]);
        }
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
