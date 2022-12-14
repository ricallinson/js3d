
var canvas = document.getElementById("viewport");
var ctx = canvas.getContext("2d");

var height = canvas.clientWidth;
var width = canvas.clientHeight;
var centerHeight = canvas.height / 2;
var centerWidth = canvas.width / 2;

var posX = 0;
var posY = 0;
var posZ = -25;
var posR = 0;

var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var moveForwards = false;
var moveBackwards = false;
var rotateLeft = false;
var rotateRight = false;

document.body.addEventListener('keydown', function(e) {
    updateKeys(e.keyCode, true);
});

document.body.addEventListener('keyup', function(e) {
    updateKeys(e.keyCode, false);
});

function updateKeys(code,val) {
    switch (code) {
    case 37:
        moveLeft = val;
        break; //moveLeft key
    case 38:
        moveUp = val;
        break; //Up key
    case 39:
        moveRight = val;
        break; //moveRight key
    case 40:
        moveDown = val;
        break; //Down key
    case 87:
        moveForwards = val;
        break; //w key
    case 83:
        moveBackwards = val;
        break; //s key
    case 65:
        rotateLeft = val;
        break; //a key
    case 68:
        rotateRight = val;
        break; //d key
    // default:
    //   console.log(code);
    }
    // console.log(code);
}

function getModelPositions(model) {
    var points = [];
    var triangles = [];
    for (var i = 0; i < model.length; i++) {
        points.push(...model[i].points);
        triangles.push(...model[i].triangles);
    }
    return [points, triangles];
}

var pi = Math.PI;
var radian = 2 * pi / 180;
function updateCameraLocation(cos, sin) {
    var step = 0.5;
    if(moveUp) posY += step / 2;
    if(moveDown) posY -= step / 2;
    if(rotateLeft) posR -= step * radian;
    if(rotateRight) posR += step * radian;
    if(moveForwards) {
        posX += sin;
        posZ += cos;
    }
    if(moveBackwards) {
        posX -= sin;
        posZ -= cos;
    }
    if(moveLeft) {
        posX -= cos;
        posZ += sin;
    }
    if(moveRight) {
        posX += cos;
        posZ -= sin;
    }
}

function update(model) {
    var cos = Math.cos(posR);
    var sin = Math.sin(posR);
    updateCameraLocation(cos, sin);
    var matrix = [
        cos, null, -sin, posX,
        null, null, null, posY,
        sin, null, cos, posZ
    ];
    ctx.clearRect(0, 0, height, width);
    var [points, triangles] = getModelPositions(model);
    draw(points, triangles, matrix);
    window.requestAnimationFrame(function() {
        update(model);
    });
    console.log('X', posX, 'Y', posY, 'Z', posZ);
}

function transform(x, y, z, matrix) {
    // (cos * x) + (-sin * z) + posX
    var X = (matrix[0] * (x - matrix[3])) + (matrix[2] * (z - matrix[11]));
    // y + posY
    var Y = y + matrix[7];
    // (sin * x) + (cos * z) + posZ
    var Z = (matrix[8] * (x - matrix[3])) + (matrix[10] * (z - matrix[11]));
    // The transformed X,Y,Z.
    return [X, Y, Z];
}

// you can make a Z-buffer, sampling from texture, phong shading...
function fragmentShader(a, b, c) {
    var z = Math.min(a[2], b[2], c[2]);
    if (z < 0) return;
    var dist = 400;
    var x0 = centerWidth + (dist * a[0] / a[2]);
    var y0 = centerHeight + (dist * a[1] / a[2]);
    var x1 = centerWidth + (dist * b[0] / b[2]);
    var y1 = centerHeight + (dist * b[1] / b[2]);
    var x2 = centerWidth + (dist * c[0] / c[2]);
    var y2 = centerHeight + (dist * c[1] / c[2]);
    // Cull back-facing triangles.
    // if (((x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0)) > 0) return;
    return [z, x0, x1, x2, y0, y1, y2, 'rgba(150, 150, 150, 1)'];
}

var lineWidth = 10;
function paintFill(positions) {
    for (var i = 0; i < positions.length; i++) {
        if (positions[i]) {
            ctx.beginPath();
            ctx.lineWidth = lineWidth / positions[i][0];
            ctx.moveTo(positions[i][1], positions[i][4]);
            ctx.lineTo(positions[i][2], positions[i][5]);
            ctx.lineTo(positions[i][3], positions[i][6]);
            ctx.lineTo(positions[i][1], positions[i][4]);
            ctx.fillStyle = positions[i][7];
            ctx.strokeStyle = '#fff';
            ctx.stroke();
            ctx.fill();
        }
    }
}

function draw(points, triangles, matrix) {
    var positions = [];
    for (var i = 0; i < triangles.length; i += 3) {
        var p0 = triangles[i] * 3;
        var p1 = triangles[i + 1] * 3;
        var p2 = triangles[i + 2] * 3;
        var a = transform(points[p0], points[p0 + 1], points[p0 + 2], matrix);
        var b = transform(points[p1], points[p1 + 1], points[p1 + 2], matrix);
        var c = transform(points[p2], points[p2 + 1], points[p2 + 2], matrix);
        positions.push(fragmentShader(a, b, c));
    }
    positions.sort(function sortZ(a, b) {
        return b[0] - a[0];
    });
    paintFill(positions);
}
