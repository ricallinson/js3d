// Geometry of a Model
var cubes = [];
class Cube {
    constructor(a) {
        this.offset = a;
        var v = [-1, -1, -1, 1, -1, -1, 1, -1, 1,    
            -1, -1, 1, -1, 1, -1, 1, 1, -1,
            1, 1, 1, -1, 1, 1];
        var t = [
            0, 1, 2, 
            0, 2, 3, 
            4, 5, 6, 
            4, 6, 7,
            0, 1, 4, 
            1, 4, 5, 
            1, 2, 5, 
            2, 5, 6,
            2, 3, 6, 
            3, 6, 7, 
            0, 3, 7, 
            0, 4, 7
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

for (var i = 0; i < 2; i++) {
    cubes.push(new Cube(i));
}

update(cubes);
