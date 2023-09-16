class ShapeFactory {
    static createShape(type = null, s = null, instance = null, p = Vector.$()) {
        switch (type) {
            case 'point':
                return new Vertex();
            case 'box':
                return new Box(instance, p);
            case 'circle':
                return new Circle();
            case 'polygon':
                return new PolygonShape(instance, instance.rocketFake, s, p);
            default:
                return new Vertex();
        }
    }

    static parseModel(data) {
        let vertices = [];
        for (let i = 0; i < data.points.length; i++) {
            vertices[i] = data.points[i];
        }
        let edges = [];
        for (let i = 0; i < data.sticks.length; i++) {
            let s = data.sticks[i];
            s.p0 = vertices[s.p0];
            s.p1 = vertices[s.p1];
            s.length = Utils.distance(s.p0, s.p1);
            edges[i] = s;
        }
        update();
    }
}

class Vertex {
    constructor(pos, pinned = false) {
        this.pinned = pinned;
        this.position = pos;
        this.oldPosition = new Vector(pos.getX() + Math.random() * 50 - 25, pos.getY() + Math.random() * 50 - 25);
    }
}

class Edge {
    constructor(p0, p1, length, width, hidden = false) {
        this.p0 = p0;
        this.p1 = p1;
        this.length = length;
        this.width = width;
        this.hidden = hidden;
    }
}

class Face {
    constructor(path = [], color = "red") {
        this.path = path;
        this.color = color;
    }
}