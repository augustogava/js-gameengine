
class PolygonShape extends BodyDef {
	constructor(polygon, type, position) {
		super(PolygonShape, 100, position, null, null, null);
		this.polygon = polygon;
		this.shape = this;
		this.engine = null;

		this.vertices = [];
		this.edges = [];
		this.faces = [];

		this.bounce = 0;
		this.torque = 0;
		this.momentOfInertia = 1;
		this.angularDamping = 1;
		this.friction = 1;

		ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";

		this.isrenderVertixes = true;
		this.isrenderEdges = true;
		this.isrenderForm = true;
		this.isrenderEngine = true;

		if( type && type == "box" ){
			let p = PolygonShapeBuilder.createBox(position);
			
			this.vertices = p.vertices;
			this.edges = p.edges;
			this.faces = p.faces;
		}
	}

	draw() {
		if( this.isrenderVertixes ){
			this.renderVertixes();
		}

		if( this.isrenderEdges ){
			this.renderEdges();
		}

		if( this.isrenderForm ){
			this.renderForms();
		}

		if( this.isrenderEngine ){
			this.renderEngines();
		}
	}

	renderVertixes() {
		ctx.strokeStyle = "red";
		ctx.fillStyle = "red";

		for (var i = 0; i < this.vertices.length; i++) {
			var p = this.vertices[i];
			ctx.beginPath();
			ctx.arc(p.position.getX(), p.position.getY(), 5, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	renderEdges() {
		if (this.rocketFake) {
			ctx.strokeStyle = this === this.rocketFake.selectedBody ? "red" : "black";
			ctx.fillStyle = "red";

		} else {
			ctx.strokeStyle = "black";
			ctx.fillStyle = "black";
		}

		for (var i = 0; i < this.edges.length; i++) {
			var stick = this.edges[i];
			if (!stick.hidden) {
				ctx.beginPath();
				ctx.lineWidth = stick.width ? stick.width : 1;
				ctx.moveTo(stick.p0.position.x, stick.p0.position.y);
				ctx.lineTo(stick.p1.position.x, stick.p1.position.y);
				ctx.stroke();
			}
		}
	}

	renderForms() {
		for (var i = 0; i < this.faces.length; i++) {
			var face = this.faces[i];
			ctx.beginPath();
			ctx.fillStyle = face.color;
			ctx.moveTo(face.path[0].position.x, face.path[0].position.y);
			for (var j = 1; j < face.path.length; j++) {
				ctx.lineTo(face.path[j].position.x, face.path[j].position.y);
			}
			ctx.fill();
		}
	}

	renderEngines() {
		if (!this.engine) {
			return;
		}

		this.engine.render();
	}

	rotate() {
		const center = this.getCenter();
		const cosTheta = Math.cos(this.angularVelocity);
		const sinTheta = Math.sin(this.angularVelocity);

		for (let vertex of this.polygon.vertices) {
			const dx = vertex.position.getX() - center.getX();
			const dy = vertex.position.getY() - center.getY();

			const newX = center.getX() + dx * cosTheta - dy * sinTheta;
			const newY = center.getY() + dx * sinTheta + dy * cosTheta;

			// vertex.oldPosition = vertex.position.clone();
			vertex.position.setX(newX);
			vertex.position.setY(newY);
		}
	}

	update(deltaTime) {
		// this.polygon.update();

		if (this.isDragging()) {
			let delta = eventshelper.mousepos.subtract(this.getCenter());
			this.shape.translate(delta);
		} else {
			this.position = this.getCenter();
			this.updatePhysics();

			this.updateEngines();
			this.rotate(); // Multiply by deltaTime
			this.updateVertixes();

			for (var i = 0; i < 3; i++) {
				this.updateEdges();
				this.constrainPoints();
			}

			this.positionOld = this.getCenter();
		}
	}

	updateEngines() {
		if (!this.engine) {
			return;
		}

		this.engine.update();
	}

	updateVertixes() {
		// this.velocity.addTo(this.acceleration);
		// this.velocity.multiplyBy(.99);

		for (var i = 0; i < this.vertices.length; i++) {
			var p = this.vertices[i];
			if (!p.pinned) {
				var vx = (p.position.getX() - p.oldPosition.getX()) * this.friction;
				var vy = (p.position.getY() - p.oldPosition.getY()) * this.friction;

				p.oldPosition = p.position.clone();

				p.position.addTo(new Vector(vx, vy));
				// p.position.addTo(new Vector(0, .5));
				p.position.addTo(this.velocity);
			}
		}

		this.acceleration = new Vector(0, 0);
	}

	updateEdges() {
		for (var i = 0; i < this.edges.length; i++) {
			var stick = this.edges[i];
			var dx = stick.p1.position.x - stick.p0.position.x,
				dy = stick.p1.position.y - stick.p0.position.y,
				distance = Math.sqrt(dx * dx + dy * dy),
				difference = stick.length - distance,
				percent = difference / distance / 2,
				offsetX = dx * percent,
				offsetY = dy * percent;

			if (!stick.p0.pinned) {
				stick.p0.position.x -= offsetX;
				stick.p0.position.y -= offsetY;
			}
			if (!stick.p1.pinned) {
				stick.p1.position.x += offsetX;
				stick.p1.position.y += offsetY;
			}

		}
	}

	updatePhysics() {
		// Update angular properties
		this.angularVelocity += this.torque / this.momentOfInertia;
		this.angularVelocity = this.angularVelocity * this.angularDamping;
		this.rotation += this.angularVelocity; // Multiply by deltaTime
		this.torque = 0;
	}

	translate(delta) {
		this.polygon.velocity.multiplyBy(0);

		for (let vertex of this.polygon.vertices) {
			vertex.oldPosition = vertex.position.clone();
			vertex.position.addTo(delta);
		}
	}


	projectOntoAxis(axis) {
		let min = axis.dot(this.polygon.vertices[0].position);
		let max = min;

		for (let vertex of this.polygon.vertices) {
			let projection = axis.dot(vertex.position);
			min = Math.min(min, projection);
			max = Math.max(max, projection);
		}

		return [min, max];
	}

	getOverlap(minA, maxA, minB, maxB) {
		if (minA < minB) {
			return (maxA < minB) ? null : minB - maxA;
		} else {
			return (maxB < minA) ? null : minA - maxB;
		}
	}

	resolveCollisionWithPolygon(otherPolygon) {
		let smallestOverlap = Infinity;
		let smallestAxis = null;
		let collisionPoint = null;

		let allEdges = this.polygon.edges.concat(otherPolygon.edges);

		for (let edge of allEdges) {
			let axis = new Vector(edge.p1.position.getY() - edge.p0.position.getY(), edge.p0.position.getX() - edge.p1.position.getX()).normalize();

			let [minA, maxA] = this.projectOntoAxis(axis);
			let [minB, maxB] = otherPolygon.shape.projectOntoAxis(axis);

			let overlap = this.getOverlap(minA, maxA, minB, maxB);

			if (overlap === null) {
				return; // No collision
			} else if (overlap < smallestOverlap) {
				smallestOverlap = overlap;
				smallestAxis = axis;
			}
		}

		if (smallestAxis) {
			let centerPolygon = this.getCenter(); // Assuming you have a method to get the center of the polygon
			let directionToOther = otherPolygon.shape.getCenter().subtract(centerPolygon).normalize();

			// Ensure the impulse is in the correct direction
			if (smallestAxis.dot(directionToOther) < 0) {
				smallestAxis = smallestAxis.multiply(-1); // Reverse the direction of the impulse
			}

			// Calculate the impulse based on overlap and some constant factor
			let impulse = smallestAxis.multiply(smallestOverlap * 2);
			impulse.multiplyBy(.1);
			// Adjust velocities based on impulse
			let polygonMass = this.polygon.mass || 1;
			let otherMass = otherPolygon.mass || 1;
			let totalMass = polygonMass + otherMass;

			let collisionPoint = this.getCenter().add(otherPolygon.shape.getCenter()).multiplyBy(0.5);

			let r = this.getCenter().subtract(collisionPoint);
			// this.torque = r.cross(impulse);
			this.polygon.velocity.subtractFrom(impulse.multiply(otherMass / totalMass));
			otherPolygon.velocity.addTo(impulse.multiply(polygonMass / totalMass));
		}

		//chat
		// if (smallestAxis) {
		// 	let impulse = smallestAxis.multiply(smallestOverlap);
		// 	let polygonMassA = this.polygon.mass || 1;
		// 	let polygonMassB = otherPolygon.mass || 1;
		// 	let totalMass = polygonMassA + polygonMassB;

		// 	this.polygon.velocity.subtractFrom(impulse.multiply(polygonMassB / totalMass));
		// 	otherPolygon.velocity.addTo(impulse.multiply(polygonMassA / totalMass));

		// 	// Calculate the collision point
		// 	collisionPoint = this.getCenter().add(otherPolygon.shape.getCenter()).multiplyBy(0.5);

		// 	// Calculate the torque for both polygons
		// 	let rA = this.getCenter().subtract(collisionPoint);
		// 	let rB = otherPolygon.shape.getCenter().subtract(collisionPoint);

		// 	let torqueA = rA.cross(impulse);
		// 	let torqueB = rB.cross(impulse);

		// 	this.angularVelocity += torqueA / this.momentOfInertia;
		// 	otherPolygon.shape.angularVelocity += torqueB / otherPolygon.shape.momentOfInertia;

		// 	// Apply angular damping (if needed)
		// 	this.angularVelocity *= this.angularDamping;
		// 	otherPolygon.shape.angularVelocity *= otherPolygon.shape.angularDamping;
		// }
	}

	resolveCollisionWithCircle = function (circle) {
		let smallestOverlap = Infinity;
		let smallestAxis = null;
		let collisionPoint = null;

		// Check for circle's position inside the polygon
		if (this.containsPoint(circle.position)) {
			for (let edge of this.polygon.edges) {
				let axis = new Vector(edge.p1.position.getY() - edge.p0.position.getY(), edge.p0.position.getX() - edge.p1.position.getX()).normalize();
				let overlap = circle.radius - circle.distanceToLineSegment(edge.p0.position, edge.p1.position);
				if (overlap < smallestOverlap) {
					smallestOverlap = overlap;
					smallestAxis = axis;
				}
			}
		}

		// Check for this polygon's vertex inside the circle
		for (let vertex of this.polygon.vertices) {
			if (circle.containsPoint(vertex.position)) {
				let axis = vertex.position.subtract(circle.position).normalize();
				let overlap = circle.radius - vertex.position.distance(circle.position);
				if (overlap < smallestOverlap) {
					smallestOverlap = overlap;
					smallestAxis = axis;
				}
			}
		}

		// Check for circle close to this polygon's edge
		for (let edge of this.polygon.edges) {
			let distance = circle.distanceToLineSegment(edge.p0.position, edge.p1.position);
			if (distance < circle.radius) {
				let axis = edge.p0.position.add(edge.p1.position).multiplyBy(0.5).subtractFrom(circle.position).normalize();
				let overlap = circle.radius - distance;
				if (overlap < smallestOverlap) {
					smallestOverlap = overlap;
					smallestAxis = axis;
				}
			}
		}

		if (smallestAxis) {
			// Calculate the direction from the polygon's center to the circle's center
			let centerPolygon = this.getCenter(); // Assuming you have a method to get the center of the polygon
			let directionToCircle = circle.position.subtract(centerPolygon).normalize();

			// Ensure the impulse is in the correct direction
			if (smallestAxis.dot(directionToCircle) < 0) {
				smallestAxis = smallestAxis.multiply(-1); // Reverse the direction of the impulse
			}

			// // Calculate the impulse based on overlap and some constant factor
			// let impulse = smallestAxis.multiply(smallestOverlap * 2);

			// // Adjust velocities based on impulse
			// let polygonMass = this.polygon.mass || 1;
			// let circleMass = circle.mass || 1;
			// let totalMass = polygonMass + circleMass;

			// let collisionPoint = circle.position.subtract(smallestAxis.multiply(circle.radius - smallestOverlap * 0.5));
			// let r = this.getCenter().subtract(collisionPoint);
			// let torque = r.cross(impulse); // Assuming you have a cross product method in your Vector class
			// this.angularVelocity = torque * 0.001; // Adjust the multiplier as needed

			// this.polygon.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
			// circle.velocity.addTo(impulse.multiply(polygonMass / totalMass));


			// Calculate the impulse based on overlap and some constant factor
			let impulse = smallestAxis.multiply(smallestOverlap * 2);

			// Adjust velocities based on impulse
			let polygonMass = this.mass || 1;
			let circleMass = circle.mass || 1;
			let totalMass = polygonMass + circleMass;

			this.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
			circle.velocity.addTo(impulse.multiply(polygonMass / totalMass));

			// Calculate Torque due to the collision
			collisionPoint = circle.position.subtract(smallestAxis.multiply(circle.radius - smallestOverlap * 0.5));
			let r = this.getCenter().subtract(collisionPoint);
			this.torque = r.cross(impulse);

			this.torque = this.torque * .1;
		}
	}

	getCenter() {
		let sumX = 0;
		let sumY = 0;
		let numVertices = this.polygon.vertices.length;

		for (let vertex of this.polygon.vertices) {
			sumX += vertex.position.getX();
			sumY += vertex.position.getY();
		}

		return new Vector(sumX / numVertices, sumY / numVertices);
	}

	containsPoint(pointVector) {
		let x = pointVector.getX(), y = pointVector.getY();
		let inside = false;
		for (let i = 0, j = this.polygon.vertices.length - 1; i < this.polygon.vertices.length; j = i++) {
			let xi = this.polygon.vertices[i].position.getX(), yi = this.polygon.vertices[i].position.getY();
			let xj = this.polygon.vertices[j].position.getX(), yj = this.polygon.vertices[j].position.getY();

			let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}

		return inside;
	}

	distanceToLineSegment(polygon, p0, p1) {
		let dx = p1.x - p0.x;
		let dy = p1.y - p0.y;
		let t = ((polygon.position.x - p0.x) * dx + (polygon.position.y - p0.y) * dy) / (dx * dx + dy * dy);
		t = Math.max(0, Math.min(1, t));

		let nearest = new Vector(p0.x + t * dx, p0.y + t * dy);
		let distX = polygon.position.x - nearest.x;
		let distY = polygon.position.y - nearest.y;

		return Math.sqrt(distX * distX + distY * distY);
	}

	constrainPoints() {
		for (var i = 0; i < this.polygon.vertices.length; i++) {
			var p = this.polygon.vertices[i];
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

	getCenter() {
		let sumX = 0;
		let sumY = 0;
		let numVertices = this.vertices.length;

		for (let vertex of this.vertices) {
			sumX += vertex.position.getX();
			sumY += vertex.position.getY();
		}

		return new Vector(sumX / numVertices, sumY / numVertices);
	}
}