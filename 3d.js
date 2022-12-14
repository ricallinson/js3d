
var canvas = document.getElementById("viewport");
var ctx = canvas.getContext("2d");

var height = canvas.clientWidth;
var width = canvas.clientHeight;

var posX = 0; //15;
var posY = 0; //5;
var posZ = 0; //40;
var posR = 0; //0;

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
    case 87:
        moveUp = val;
        break; //Up key
    case 39:
        moveRight = val;
        break; //moveRight key
    case 83:
        moveDown = val;
        break; //Down key
    case 38:
        moveForwards = val;
        break; //w key
    case 40:
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
}

function getPositions(models) {
    var points = [];
    var triangles = [];
    for (var i = 0; i < models.length; i++) {
        points.push(...models[i].points);
        triangles.push(...models[i].triangles);
    }
    return [points, triangles];
}

function update(models) {
    if(moveLeft) posX += 2;
    if(moveRight) posX -= 2;
    if(moveUp) posY += 2;
    if(moveDown) posY -= 2;
    if(moveForwards) posZ -= 2;
    if(moveBackwards) posZ += 2;
    if(rotateLeft) posR -= 2;
    if(rotateRight) posR += 2;

    var angle = posR * 0.0123;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var blockHeight = 1;
    var matrix = [cos, 0, sin * -1, posX, 0, blockHeight, 0, posY, sin, 0, cos, posZ];
    console.log(matrix);
    ctx.clearRect(0, 0, height, width);
    var [points, triangles] = getPositions(models);
    draw(points, triangles, matrix);
    window.requestAnimationFrame(function() {
        update(models);
    });
}

function transform(x, y, z, matrix) {
    // (cos * x) + (0 * y) + (-sin * z) + posX
    var X = (matrix[0] * x) + /*(matrix[1] * y) +*/ (matrix[2] * z);// + matrix[3];
    // (0 * x) + (blockHeight * y) + (0 * z) + posY
    var Y = (matrix[4] * x) + (matrix[5] * y) + (matrix[6] * z) + matrix[7];
    // (sin * x) + (0 * y) + (cos * z) + posZ
    var Z = (matrix[8] * x) + /*(matrix[9] * y) +*/ (matrix[10] * z);// + matrix[11];
    // The transformed X,Y,Z.
    return [X, Y, Z];
}

// you can make a Z-buffer, sampling from texture, phong shading...
function fragmentShader(a, b, c) {
    var z = Math.min(a[2], b[2], c[2]);
    if (z < 0) return;
    var dist = 400;
    var x0 = dist * a[0] / a[2];
    var y0 = dist * a[1] / a[2];
    var x1 = dist * b[0] / b[2];
    var y1 = dist * b[1] / b[2];
    var x2 = dist * c[0] / c[2];
    var y2 = dist * c[1] / c[2];
    return [z, x0, x1, x2, y0, y1, y2, 'rgba(150, 150, 150, 1)'];
}

var lineWidth = 5;
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
