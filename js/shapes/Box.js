class Box extends BodyDef {
	constructor(rocketFake, position) {
		super(Box, 100, position, null, null, null);
		this.rocketFake = rocketFake;

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
			this.movement.addTo(new Vector(-1, 0));
		}

		if (key === 'ArrowRight') {
			this.movement.addTo(new Vector(1, 0));
		}

		if (key === 'ArrowUp') {
			this.movement.addTo(new Vector(0, 1));
		}

		if (key === 'ArrowDown') {
			this.movement.addTo(new Vector(-1, 0));
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
}