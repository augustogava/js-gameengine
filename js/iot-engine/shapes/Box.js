class Box extends BodyDef {
	constructor(rocketFake, x1, y1, x2, y2, mass, width, angle) {
		super(Box, mass, new Vector(x1, y1));
		this.rocketFake = rocketFake;
		this.physics = new Physics(this);

		this.bounce = 0;
		this.friction = .7;

		this.setBodyType('dynamic');

		this.shape = new Rectangle(x1, y1, x2, y2, width, angle)

		this.vertices = this.shape.vertices;
		this.edges = this.shape.edges;
		this.faces = this.shape.faces;

		this.position = this.shape.getPosition();

		this.inertia = this.mass* (this.shape.width ** 2 + this.shape.length ** 2) / 12;
		if (this.mass=== 0) {
			this.inv_inertia = 0;
		} else {
			this.inv_inertia = 1 / this.inertia;
		} 
	}

	draw() { this.shape.draw();	}

	update(d) {
		if (this.isDragging()) {
			let delta = eventshelper.mousepos.subtract(this.getCenter());
			this.shape.position = delta;

			this.shape.getVertices();

			this.position = this.shape.getPosition();
		} else {
			this.shape.update(d);

			this.position = this.shape.getPosition();
		}

		this.shape.acceleration = new Vector(0,0);
	}

	userAction(key) {	
		if (eventshelper.keycode) {

            if (eventshelper.keycode === 'ArrowLeft') {
                this.shape.acceleration.addTo(new Vector(-1, 0));
            }

            if (eventshelper.keycode === 'ArrowRight') {
                this.shape.acceleration.addTo(new Vector(1, 0));
            }

            if (eventshelper.keycode === 'ArrowUp') {
                this.shape.acceleration.addTo(new Vector(0, -1));
            }

            if (eventshelper.keycode === 'ArrowDown') {
                this.shape.acceleration.addTo(new Vector(0, 1));
            }
		}
	}

	getInputFieldsConfig() {
		return {
			'Rectangle': [
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

	updateFieldUserInstance(property, value) {
		console.log(property)
	}







	//OLD -----------

	intersects(otherShape) {
		if (otherShape.shape instanceof Circle) {
			return this.collidesWithCircle(otherShape);
		} else if (otherShape.shape instanceof PolygonShape) {
			return this.shape.resolveCollisionWithPolygon(otherShape);
		}
	}

	resolveCollision(otherShape) {
		if (otherShape.shape instanceof Circle) {
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