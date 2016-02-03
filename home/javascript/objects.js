
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


function Color(r, g, b, a) {
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
