
function Point3D (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}


function Point (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}


function Sprite(points) {
    this.Points = points || [];
}


function RGBA(r, g, b, a) {
    this.R = r || 0;
    this.G = g || 0;
    this.B = b || 0;
    this.A = a || 1;

    this.toString = function() {
        return "rgba(" + this.R + "," + this.G + "," + this.B + "," + this.A + ")";
    };

    this.clone = function() {
        return new RGBA(this.R,this.G,this.B,this.A);
    }
}

function Control(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.color = new RGBA(89, 79, 79);
    this.radius = 20;

    this.drawToContext = function(theContext) {
         theContext.fillStyle = this.color;
         theContext.beginPath();
         theContext.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
         theContext.closePath();
         theContext.fill();
    }

    this.hitTest = function(hitX,hitY) {
         var dx = this.x - hitX;
         var dy = this.y - hitY;
         return(dx*dx + dy*dy < this.radius*this.radius);
    }
}