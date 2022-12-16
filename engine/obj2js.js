const fs = require('fs');

var data = fs.readFileSync('./engine/sphere.obj', 'utf8').split('\n');

var obj = {
    numPoints: 0,
    points:    [],
    triangles: []
};

function lineToNum(line, offset) {
    var nums = [];
    line.split('\t').forEach(function(part) {
        if (part && typeof part === 'string') {
            nums.push(parseFloat(part.replace(/[^0-9.-]/g, '')) + offset);
        }
    });
    if (nums.length !== 3) {
        process.exit(1);
    }
    return nums;
}

data.forEach(function(line) {
    switch(line[0]) {
    case 'v':
        obj.points.push(...lineToNum(line, 0));
        obj.numPoints++;
        break;
    case 'f':
        obj.triangles.push(...lineToNum(line, -1));
        break;
    }
});

fs.writeFileSync('./engine/sphere.js', `var sphere = ${JSON.stringify(obj)};`);
