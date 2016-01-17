
function Point3D(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}


function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}


function Sprite(points) {
    this.Points = points || [];
}


function RGBA(r, g, b, a) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;

    this.toString = function() {
        return "rgba(" + this.R + "," + this.G + "," + this.B + ",1)";
    };

    this.clone = function() {
        return new RGBA(this.R,this.G,this.B,this.A);
    }
}