class Cube {
    constructor(index, x, y, z) {
        this.location = [x, y, z];
        this.points = [];
        this.triangles = [];
        var points = [-1, -1, -1, 1, -1, -1, 1, -1, 1,    
            -1, -1, 1, -1, 1, -1, 1, 1, -1,
            1, 1, 1, -1, 1, 1];
        var triangles = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
            0, 1, 4, 1, 4, 5, 1, 2, 5, 2, 5, 6,
            2, 3, 6, 3, 6, 7, 0, 3, 7, 0, 4, 7
        ];
        var i;
        for (i = 0; i < points.length; i += 3) {
            this.points.push(x + points[i], y + points[i + 1], z + points[i + 2]);
        }
        for (i = 0; i < triangles.length; i++) {
            this.triangles.push(index * 8 + triangles[i]);
        }
    }
}

var cubes = [];
var space = 200;
var offset = -(space / 2);
for (var i = 0; i < 1000; i++) {
    cubes.push(new Cube(i, offset + Math.random() * space, offset + Math.random() * space, offset + Math.random() * space));
}
update(cubes);
