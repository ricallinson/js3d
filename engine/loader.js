
function load(obj, index, x, y, z) {
    var model = {
        location:  [x, y, z],
        points:    [],
        triangles: []
    };
    var i;
    for (i = 0; i < obj.points.length; i += 3) {
        model.points.push(x + obj.points[i], y + obj.points[i + 1], z + obj.points[i + 2]);
    }
    for (i = 0; i < obj.triangles.length; i++) {
        model.triangles.push(index * obj.numPoints + obj.triangles[i]);
    }
    return model;
}

var model = [];
var space = 1000;
var offset = -(space / 2);
for (var i = 0; i < 100; i++) {
    model.push(load(sphere, i, offset + Math.random() * space, offset + Math.random() * space, offset + Math.random() * space));
}
update(model);
