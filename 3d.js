

// Geometry of a Model
var cubes = [];
class Cube {
  constructor(a) {
    this.offset = a;
    this.color = 'rgba(' + Math.floor(Math.random() * 256) + ',   ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', 1)';
    var v = [-1, -1, -1,     1, -1, -1,    1, -1, 1,    
             -1, -1, 1,     -1, 1, -1,     1, 1, -1,
             1, 1, 1,       -1, 1, 1];
    var t = [0, 1, 2,    2, 3, 0,    4, 5, 6,    6, 7, 4,
             0, 1, 4,    1, 4, 5,    1, 2, 5,    2, 5, 6,
             2, 3, 6,    3, 6, 7,    3, 0, 7,    0, 7, 4
    ];
    this.dx = -25 + 5 * (this.offset / 10);
    this.dy = -3 + Math.random() * 6;
    this.dz = -25 + 5 * (this.offset % 10);
    this.trngls = [];
    this.points = [];
    for (var j = 0; j < v.length; j += 3) {
      this.points.push(this.dx + v[j], this.dy + v[j + 1], this.dz + v[j + 2]);
    }
    for (var j = 0; j < t.length; j++) {
      this.trngls.push(this.offset * 8 + t[j]);
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

console.log(height, width);

var posX = 0;
var posY = 0;
var posZ = 0;
var rotation = 0;

var left=false;
var right=false;
var up=false;
var down=false;
var forwards=false;
var backwards=false;
var turnLeft=false;
var turnRight=false;

document.body.addEventListener('keydown', function(e) {
  updateKeys(e.keyCode, true);
});

document.body.addEventListener('keyup', function(e) {
  updateKeys(e.keyCode, false);
});

function updateKeys(code,val) {
  switch (code) {
    case 37:
      left=val;
      break; //Left key
    case 87:
      up=val;
      break; //Up key
    case 39:
      right=val;
      break; //Right key
    case 83:
      down=val;
      break; //Down key
    case 38:
      forwards=val;
      break; //w key
    case 40:
      backwards=val;
      break; //s key
    case 65:
      turnLeft=val;
      break; //a key
    case 68:
      turnRight=val;
      break; //d key
    // default:
    //   console.log(code);
  }
}

var positions = [];

function update() {
  if(left) posX+=2;
  if(right) posX-=2;
  if(up) posZ-=2;
  if(down) posZ+=2;
  if(forwards) posY+=2;
  if(backwards) posY-=2;
  if(turnLeft) rotation+=2;
  if(turnRight) rotation-=2;
  positions = [];
  var ang = rotation * 0.0123;
  var s = Math.sin(ang);
  var c = Math.cos(ang);
  var allPoints = [];
  var allTrngls = [];
  var allColors = [];
  // What does this do?
  var matrix = [c, 0, -s, (posX * 0.123), 0, 1, 0, (posY * 0.123), s, 0, c, (posZ * 0.123)];
  // console.log('X', posX, 'Y', posY, 'Z', posZ, 'R', rotation);
  ctx.clearRect(0, 0, height, width);
  for (var i = 0; i < cubes.length; i++) {
    allPoints.push(...cubes[i].points);
    allTrngls.push(...cubes[i].trngls);
    allColors.push(cubes[i].color);
  }
  draw(allPoints, allTrngls, matrix, allColors);
  positions.sort(sortZ);
  paintFill(positions);
  window.requestAnimationFrame(update);
}

function paintFill(pos) {
  for (var i = 0; i < pos.length; i++) {
    ctx.beginPath();
    ctx.lineWidth = 5 / pos[i][0];
    ctx.moveTo(pos[i][1], pos[i][4]);
    ctx.lineTo(pos[i][2], pos[i][5]);
    ctx.lineTo(pos[i][3], pos[i][6]);
    ctx.lineTo(pos[i][1], pos[i][4]);
    ctx.fillStyle = pos[i][7];
    // ctx.stroke();
    ctx.fill();
  }
}

var _3 = 3;

function draw(ps, ts, matrix, color) {
  for (var i = 0; i < ts.length; i += 3) {
    var p0 = ts[i] * _3;
    var p1 = ts[i + 1] * _3;
    var p2 = ts[i + 2] * _3;
    var a = vertexShader(ps[p0], ps[p0 + 1], ps[p0 + 2], matrix);
    var b = vertexShader(ps[p1], ps[p1 + 1], ps[p1 + 2], matrix);
    var c = vertexShader(ps[p2], ps[p2 + 1], ps[p2 + 2], matrix);
    fragmentShader(a, b, c, color[Math.floor(i / 36)]);
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
function fragmentShader(a, b, c, color) {
  var z = Math.min(a[2], b[2], c[2]);
  if (z < 0) return;
  var x0 = _200 + _300 * a[0] / a[2];
  var y0 = _150 + _300 * a[1] / a[2];
  var x1 = _200 + _300 * b[0] / b[2];
  var y1 = _150 + _300 * b[1] / b[2];
  var x2 = _200 + _300 * c[0] / c[2];
  var y2 = _150 + _300 * c[1] / c[2];
  positions.push([z, x0, x1, x2, y0, y1, y2, color]);
}

function sortZ(a, b) {
  return b[0] - a[0];
}

update();
