// Geometry of a Model
var points = [-1,-1,-1, 1,-1,-1, 1,-1, 1, -1,-1, 1, 
    -1, 1,-1, 1, 1,-1, 1, 1, 1, -1, 1, 1];
var trngls = [0,1,2, 2,3,0, 4,5,6, 6,7,4,  
    0,1,4, 1,4,5, 1,2,5, 2,5,6,
    2,3,6, 3,6,7, 3,0,7, 0,7,4];

var cnv = document.getElementById("cnv"), ctx = cnv.getContext("2d");
cnv.width = 400; cnv.height = 300;

update();

function update() {
    var t=Date.now(), ang=t/500, s=Math.sin(ang), c=Math.cos(ang);
    var mat = [c,0,-s,0, 0,1,0,0, s,0,c,4+Math.sin(t/320)];
    ctx.clearRect(0,0,400,300); draw(points, trngls, mat);
    window.requestAnimationFrame(update);
}

function draw(ps, ts, m) {
    for(var i=0; i<ts.length; i+=3) {
        var p0 = ts[i]*3, p1 = ts[i+1]*3, p2=ts[i+2]*3;
        var a = vertexShader(ps[p0], ps[p0+1], ps[p0+2], m);
        var b = vertexShader(ps[p1], ps[p1+1], ps[p1+2], m);
        var c = vertexShader(ps[p2], ps[p2+1], ps[p2+2], m);
        fragmentShader(a,b,c);
    }
}

function vertexShader(x,y,z, m) {
    var x0 = m[0]*x+m[1]*y+m[ 2]*z+m[ 3];
    var y0 = m[4]*x+m[5]*y+m[ 6]*z+m[ 7];
    var z0 = m[8]*x+m[9]*y+m[10]*z+m[11];
    return [x0,y0,z0];
}

// you can make a Z-buffer, sampling from texture, phong shading...
function fragmentShader(a,b,c) {
    var x0=200+300*a[0]/a[2], y0=150+300*a[1]/a[2];  
    var x1=200+300*b[0]/b[2], y1=150+300*b[1]/b[2]; 
    var x2=200+300*c[0]/c[2], y2=150+300*c[1]/c[2];
    // we should loop through all pixels of a 2D triangle ...
    // but we just stroke its outline
    ctx.beginPath();
    ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x0,y0);
    ctx.stroke(); //ctx.fill();
}