class Box extends PolygonShape {
	constructor(rocketFake, position) {
		super(Box, rocketFake, null, position, 100);
		this.physics = new Physics(this);

		this.bounce = 0;
		this.friction = 0;

		this.shape = ShapeFactory.createShape('polygon', 'box', this, position);
		this.shape.polygon = this;

		this.vertices = this.shape.vertices;
		this.edges = this.shape.edges;
		this.faces = this.shape.faces;

	}

	draw() {
		// this.renderPoints();
		// this.renderSticks();
		// this.renderForms();
		// this.renderEngines();
	}

	update(){
		
	}

	userAction(key) {
		if (key === 'ArrowLeft') {
			this.movementSpeed.addTo(new Vector(-1, 0));
		}

		if (key === 'ArrowRight') {
			this.movementSpeed.addTo(new Vector(1, 0));
		}

		if (key === 'ArrowUp') {
			this.movementSpeed.addTo(new Vector(0, 1));
		}

		if (key === 'ArrowDown') {
			this.movementSpeed.addTo(new Vector(-1, 0));
		}
	}

	intersects(otherShape) {
		if (otherShape.shape instanceof Ball) {
			// return false;
			return this.collidesWithCircle(otherShape);
		} else if (otherShape.shape instanceof PolygonShape) {
			// return false;
			return this.shape.resolveCollisionWithPolygon(otherShape);
		}
	}

	resolveCollision(otherShape) {
		if (otherShape.shape instanceof Ball) {
			return false;
			// return this.shape.resolveCollisionWithCircle(otherShape);
		} else if (otherShape.shape instanceof PolygonShape) {
			return 1;
		}
	}

	collidesWithCircle(circle) {
		// Check if any vertex of the polygon is inside the circle
		for (let vertex of this.vertices) {
			if (circle.containsPoint(vertex.position)) {
				return true;
			}
		}

		// Check if the circle's center is close enough to any edge of the polygon
		for (let edge of this.edges) {
			if (circle.distanceToLineSegment(edge.p0.position, edge.p1.position) < circle.radius) {
				return true;
			}
		}

		return false;
	}

	containsPoint(point) {
		let x = point.getX(), y = point.getY();
		let inside = false;
		for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
			let xi = this.vertices[i].position.getX(), yi = this.vertices[i].position.getY();
			let xj = this.vertices[j].position.getX(), yj = this.vertices[j].position.getY();

			let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
		return inside;

	}

	distanceToLineSegment(p0, p1) {
		let dx = p1.x - p0.x;
		let dy = p1.y - p0.y;
		let t = ((this.position.x - p0.x) * dx + (this.position.y - p0.y) * dy) / (dx * dx + dy * dy);
		t = Math.max(0, Math.min(1, t));
		let nearest = new Vector(p0.x + t * dx, p0.y + t * dy);
		let distX = this.position.x - nearest.x;
		let distY = this.position.y - nearest.y;
		return Math.sqrt(distX * distX + distY * distY);
	}

	constrainPoints() {
		for (var i = 0; i < this.vertices.length; i++) {
			var p = this.vertices[i];
			if (!p.pinned) {
				var vx = (p.position.getX() - p.oldPosition.getX()) * this.friction;
				var vy = (p.position.getY() - p.oldPosition.getY()) * this.friction;

				if (p.position.getX() > canvas.width) {
					p.position.setX(canvas.width);
					p.oldPosition.setX(p.position.getX() + vx * this.bounce);
				}
				else if (p.position.getX() < 0) {
					p.position.setX(0);
					p.oldPosition.setX(p.position.getX() + vx * this.bounce);
				}
				if (p.position.getY() > canvas.height) {
					p.position.setY(canvas.height);
					p.oldPosition.setY(p.position.getY() + vy * this.bounce);
				}
				else if (p.position.getY() < 0) {
					p.position.setY(0);
					p.oldPosition.setY(p.position.getY() + vy * this.bounce);
				}
			}
		}
	}

	getInputFieldsConfig(){
        return {
            'Box': [
                // { id: 'speed', label: 'Speed', type: 'number', value: this.getSpeed() },
                { id: 'color', label: 'Color', type: 'color', value: this.color },
                { id: 'width', label: 'Radius', type: 'number', value: this.radius },
                // { id: 'mass', label: 'Mass', type: 'number', value: this.mass },
                // { id: 'width', label: 'Width', type: 'number', value: rocketWidth },
                { id: 'positionX', label: 'Position X', type: 'number', value: this.position.getX() },
                { id: 'positionY', label: 'Position Y', type: 'number', value: this.position.getY() }
            ]
        };
    }

    updateFieldUserInstance(property, value){
        console.log(property)
    }

	rotMx(angle){
		let mx = new Matrix(2,2);
		mx.data[0][0] = Math.cos(angle);
		mx.data[0][1] = -Math.sin(angle);
		mx.data[1][0] = Math.sin(angle);
		mx.data[1][1] = Math.cos(angle);
		return mx;
	}

    getVertices(){
        this.rotMat = Matrix.rotMx(this.angle);
        this.dir = this.rotMat.multiplyVec(this.refDir);
        this.vertex[0] = this.pos.add(this.dir.mult(-this.length/2)).add(this.dir.normal().mult(this.width/2));
        this.vertex[1] = this.pos.add(this.dir.mult(-this.length/2)).add(this.dir.normal().mult(-this.width/2));
        this.vertex[2] = this.pos.add(this.dir.mult(this.length/2)).add(this.dir.normal().mult(-this.width/2));
        this.vertex[3] = this.pos.add(this.dir.mult(this.length/2)).add(this.dir.normal().mult(this.width/2));
    }
}