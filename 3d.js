

// Geometry of a Model
var cubes = [];
class Cube {
    constructor(a) {
        this.offset = a;
        var v = [-1, -1, -1, 1, -1, -1, 1, -1, 1,    
            -1, -1, 1, -1, 1, -1, 1, 1, -1,
            1, 1, 1, -1, 1, 1];
        var t = [0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4,
            0, 1, 4, 1, 4, 5, 1, 2, 5, 2, 5, 6,
            2, 3, 6, 3, 6, 7, 3, 0, 7, 0, 7, 4
        ];
        this.dx = -25 + 5 * (this.offset / 10);
        this.dy = -3 + Math.random() * 6;
        this.dz = -25 + 5 * (this.offset % 10);
        // Plot
        var j;
        this.points = [];
        for (j = 0; j < v.length; j += 3) {
            this.points.push(this.dx + v[j], this.dy + v[j + 1], this.dz + v[j + 2]);
        }
        this.triangles = [];
        for (j = 0; j < t.length; j++) {
            this.triangles.push(this.offset * 8 + t[j]);
        }
    }
}

for (var i = 0; i < 100; i++) {
    cubes.push(new Cube(i));
}

var canvas = document.getElementById("viewport");
var ctx = canvas.getContext("2d");
var height = canvas.clientWidth;
var width = canvas.clientHeight;

var posX = 0;
var posY = 0;
var posZ = 0;
var posR = 0;

var moveLeft=false;
var moveRight=false;
var moveUp=false;
var moveDown=false;
var moveForwards=false;
var moveBackwards=false;
var rotateLeft=false;
var rotateRight=false;

document.body.addEventListener('keydown', function(e) {
    updateKeys(e.keyCode, true);
});

document.body.addEventListener('keyup', function(e) {
    updateKeys(e.keyCode, false);
});

function updateKeys(code,val) {
    switch (code) {
    case 37:
        moveLeft=val;
        break; //moveLeft key
    case 87:
        moveUp=val;
        break; //Up key
    case 39:
        moveRight=val;
        break; //moveRight key
    case 83:
        moveDown=val;
        break; //Down key
    case 38:
        moveForwards=val;
        break; //w key
    case 40:
        moveBackwards=val;
        break; //s key
    case 65:
        rotateLeft=val;
        break; //a key
    case 68:
        rotateRight=val;
        break; //d key
    // default:
    //   console.log(code);
    }
}

function getPositions(cubes) {
    var points = [];
    var triangles = [];
    for (var i = 0; i < cubes.length; i++) {
        points.push(...cubes[i].points);
        triangles.push(...cubes[i].triangles);
    }
    return [points, triangles];
}

function update() {
    if(moveLeft) posX += 2;
    if(moveRight) posX -= 2;
    if(moveUp) posZ -= 2;
    if(moveDown) posZ += 2;
    if(moveForwards) posY += 2;
    if(moveBackwards) posY -= 2;
    if(rotateLeft) posR += 2;
    if(rotateRight) posR -= 2;
    positions = [];
    var ang = posR * 0.0123;
    var s = Math.sin(ang);
    var c = Math.cos(ang);
    // What does this do?
    var matrix = [c, 0, -s, (posX * 0.123), 0, 1, 0, (posY * 0.123), s, 0, c, (posZ * 0.123)];
    // console.log('X', posX, 'Y', posY, 'Z', posZ, 'R', posR);
    ctx.clearRect(0, 0, height, width);
    var [points, triangles] = getPositions(cubes);
    var positions = draw(points, triangles, matrix);
    positions.sort(sortZ);
    paintFill(positions);
    window.requestAnimationFrame(update);
}

function paintFill(positions) {
    for (var i = 0; i < positions.length; i++) {
        if (positions[i]) {
            ctx.beginPath();
            ctx.lineWidth = 5 / positions[i][0];
            ctx.moveTo(positions[i][1], positions[i][4]);
            ctx.lineTo(positions[i][2], positions[i][5]);
            ctx.lineTo(positions[i][3], positions[i][6]);
            ctx.lineTo(positions[i][1], positions[i][4]);
            ctx.fillStyle = positions[i][7];
            ctx.stroke();
            ctx.fill();
        }
    }
}

function vertexShader(x, y, z, matrix) {
    var x0 = matrix[0] * x + matrix[1] * y + matrix[2] * z + matrix[3];
    var y0 = matrix[4] * x + matrix[5] * y + matrix[6] * z + matrix[7];
    var z0 = matrix[8] * x + matrix[9] * y + matrix[10] * z + matrix[11];
    return [x0, y0, z0];
}

var _150 = 150;
var _200 = 200;
var _300 = 300;
// you can make a Z-buffer, sampling from texture, phong shading...
function fragmentShader(a, b, c) {
    var z = Math.min(a[2], b[2], c[2]);
    if (z < 0) return;
    var x0 = _200 + _300 * a[0] / a[2];
    var y0 = _150 + _300 * a[1] / a[2];
    var x1 = _200 + _300 * b[0] / b[2];
    var y1 = _150 + _300 * b[1] / b[2];
    var x2 = _200 + _300 * c[0] / c[2];
    var y2 = _150 + _300 * c[1] / c[2];
    return [z, x0, x1, x2, y0, y1, y2, 'rgba(150, 150, 150, 1)'];
}

var _3 = 3;
function draw(points, triangles, matrix) {
    var positions = [];
    for (var i = 0; i < triangles.length; i += 3) {
        var p0 = triangles[i] * _3;
        var p1 = triangles[i + 1] * _3;
        var p2 = triangles[i + 2] * _3;
        var a = vertexShader(points[p0], points[p0 + 1], points[p0 + 2], matrix);
        var b = vertexShader(points[p1], points[p1 + 1], points[p1 + 2], matrix);
        var c = vertexShader(points[p2], points[p2 + 1], points[p2 + 2], matrix);
        positions.push(fragmentShader(a, b, c));
    }
    return positions;
}

function sortZ(a, b) {
    return b[0] - a[0];
}

update();
