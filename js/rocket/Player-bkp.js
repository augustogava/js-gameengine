class Ball extends BodyDef {
    constructor(rocketFake, position) {
        super(Ball, 100, position, null, null, null);
        this.gamePhysics = new Physics(this);
        this.setBodyType('dynamic');
        this.createShape('circle');

        // const fixture = Fixture.createFixture( );
        // this.createFixture(fixture);

        this.rocketFake = rocketFake;
        this.radius = 40;
        this.rotation = 0

        this.forceCalculated = 0;
        this.maxForceDistanceEvaluator = 40;
        this.directionLenth = 130;
        this.color = "#FC6C64";
        this.force = new Vector(0, 0);
        this.directionBoost = new Vector(0, 0);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.camerabox = Camera.createCameraBox({
            position: new Vector(this.position.getX(), this.position.getY()),
            width: 600,
            height: 300
        });

        this.init();
    }

    reset() {
        this.init();
    }

    init() {
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

	resolveCollision(otherShape) {
		if (otherShape.shape instanceof PolygonShape) {
			// return this.resolveCollisionWithPolygon(otherShape);
		}
	}

    resolveCollisionWithPolygon(polygon) {
        let smallestOverlap = Infinity;
        let smallestAxis = null;
    
        // Check for this circle's position inside the polygon
        if (polygon.containsPoint(this.position)) {
            for (let edge of polygon.edges) {
                let axis = new Vector(edge.p1.position.getY() - edge.p0.position.getY(), edge.p0.position.getX() - edge.p1.position.getX()).normalize();
                let overlap = this.radius - this.distanceToLineSegment(edge.p0.position, edge.p1.position);
                if (overlap < smallestOverlap) {
                    smallestOverlap = overlap;
                    smallestAxis = axis;
                }
            }
        }
    
        // Check for polygon's vertex inside the circle
        for (let vertex of polygon.vertices) {
            if (this.containsPoint(vertex.position)) {
                let axis = vertex.position.subtract(this.position).normalize();
                let overlap = this.radius - vertex.position.distance(this.position);
                if (overlap < smallestOverlap) {
                    smallestOverlap = overlap;
                    smallestAxis = axis;
                }
            }
        }
    
        // If there's a collision, adjust velocities based on impulse
        if (smallestAxis) {
            // Calculate the direction from the circle's center to the polygon's center
            let centerPolygon = polygon.getCenter();
            let directionToPolygon = this.position.subtract(centerPolygon).normalize();
    
            // Ensure the impulse is in the correct direction
            if (smallestAxis.dot(directionToPolygon) < 0) {
                smallestAxis = smallestAxis.multiply(-1); // Reverse the direction of the impulse
            }
    
            // Calculate the impulse based on overlap and some constant factor
            let impulse = smallestAxis.multiply(smallestOverlap * 2);
            
            // Adjust velocities based on impulse
            let circleMass = this.mass || 1;
            let polygonMass = polygon.mass || 1;
            let totalMass = circleMass + polygonMass;
    
            this.velocity.addTo(impulse.multiply(polygonMass / totalMass));
            polygon.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
        }
    }

    intersects(otherShape) {
        if (otherShape.shape instanceof Box) {
            return this.collidesWithPolygon(otherShape);
        }
    }

    collidesWithPolygon(polygon) {
        // Check if the circle's center is inside the polygon
        if (polygon.containsPoint(this.position)) {
            return true;
        }

        // Check if any vertex of the polygon is inside the circle
        for (let vertex of polygon.vertices) {
            if (this.containsPoint(vertex.position)) {
                return true;
            }
        }

        // Check if the circle's center is close enough to any edge of the polygon
        for (let edge of polygon.edges) {
            if (this.distanceToLineSegment(edge.p0.position, edge.p1.position) < this.radius) {
                return true;
            }
        }

        return false;
    }

    containsPoint(point) {
        return this.position.distance(point) <= this.radius;
    }

    distanceToLineSegment(p0, p1) {
        let dx = p1.getX() - p0.getX();
        let dy = p1.getY() - p0.getY();
        let t = ((this.position.getX() - p0.getX()) * dx + (this.position.getY() - p0.getY()) * dy) / (dx * dx + dy * dy);
        t = Math.max(0, Math.min(1, t));
        let nearest = new Vector(p0.getX() + t * dx, p0.getY() + t * dy);
        
        return this.position.distance(nearest);
    }

    accel(v) {
        if (this.getSpeed() > 3 || (canvas.height - this.position.getY() - this.radius > 25)) {
            this.throttle = false;
            this.rocketFake.throttle = false;
            return;
        }

        this.throttle = true;
        this.acceleration.addTo(new Vector(v, 0));
    }

    getSpeed() {
        return this.acceleration.getLength();
    }

    applyBoost(v) {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }
        let f = this.forceMouseDown.addValBy(10).multiplyBy(0.2).getLength();
        if (f > this.maxForceDistanceEvaluator)
            f = this.maxForceDistanceEvaluator;

        this.forceCalculated = Math.abs(f);

        if (this.forceCalculated <= 0.1 || !this.direction) {
            this.forceCalculated = 0;
            this.boost = false;
            return;
        }

        if (this.forceCalculated > this.maxForceDistanceEvaluator) {
            this.forceCalculated = this.maxForceDistanceEvaluator;
        }

        let mn = this.direction.normalize();
        mn.multiplyBy(this.forceCalculated);

        this.acceleration.addTo(mn.multiplyBy(.3));
        this.forceCalculated = 0;
        this.boost = false;
    }

    initBoost(v) {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }

        this.directionBoost = eventshelper.mousepos.subtract(this.position);
        this.boost = true;
    }

    updatecamerabox() {
        this.camerabox = {
            position: new Vector(this.position.getX(), this.position.getY()),
            width: canvas.width / 2.3,
            height: this.camerabox.height
        }

        this.rocketFake.camera.updateCameraPlayer(this);
    }

    userAction(key){
		if (key === 'ArrowLeft') {
			this.movement.addTo( new Vector(-1,0) );
		}

		if (key === 'ArrowRight') {
			this.movement.addTo(new Vector(1,0));
		}

		if (key === 'ArrowUp') {
			this.movement.addTo(new Vector(0,-1));
		}

		if (key === 'ArrowDown') {
			this.movement.addTo(new Vector(0,1));
		}
	}

    update(deltaTime) {
        if (!this.rocketFake.throttle && this.rocketFake.break) {
            this.acceleration.multiplyBy(.7);
        }

        this.updateBodyDef();

        if( this.movement.getX() != 0  ||  this.movement.getY() != 0 ){
            let movementForceDirection = this.movement.normalize() ;
            let force = movementForceDirection.multiply( .5 );
            // this.acceleration.addTo(force) ;
            this.velocity.addTo(force) ;

        }

        this.acceleration.multiplyBy(.9);

        this.velocity.addTo(this.acceleration);
        this.position.addTo(this.velocity);
        this.lastPosition = this.position;

        this.direction = eventshelper.mousepos.subtract(this.position);
        this.force = eventshelper.mousepos.subtract(this.position);
        this.forceMouseDown = eventshelper.mousepos.subtract(game.mouseDownInitPosition);

        this.updatecamerabox();

        if (Globals.getBoundaries()) {
            if (this.position.y + this.radius >= canvas.height) {
                this.position.y = canvas.height - this.radius;

                this.acceleration.y = this.acceleration.y * -1;
                this.velocity.y = this.velocity.y * -1;
                this.velocity.multiplyBy(.9);
            }

            if (this.position.y - this.radius <= 0) {
                this.position.y = this.radius;
                this.velocity.y = this.velocity.y * -1;
                this.velocity.multiplyBy(.9);
            }

            if (this.position.x + this.radius >= canvas.width) {
                this.position.x = canvas.width - this.radius;
                this.velocity.x = this.velocity.x * -1;
                this.acceleration.x = this.acceleration.x * -1;
                this.velocity.multiplyBy(.9);
            }

            if (this.position.x - this.radius <= 0) {
                this.position.x = 0 + this.radius;
                this.velocity.x = this.velocity.x * -1;
                this.acceleration.x = this.acceleration.x * -1;
                this.velocity.multiplyBy(.9);
            }
        }
    }

    draw() {
        // ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        if (this.imgLoad) {
            ctx.drawImage(this.img, 0, 0);
        }

        super.drawSuper();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.closePath();

        this.drawDirection();
        this.drawForce();

        if (Globals.isDebug()) {
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            // ctx.fillText("Direct X: " + this.direction.normalize().getAngle() + " Y: " + this.direction.normalize().getLength(), this.position.getX() - 70, this.position.getY() - this.radius - 55);

            ctx.fillText("Accele:" + this.acceleration.getLength() + " | Thottle:" + this.rocketFake.throttle + " Force:" + this.forceCalculated, this.position.getX() - 50, this.position.getY() - this.radius - 30);
            ctx.restore();

            ctx.fillStyle = 'rgba(0,0,255,0.2)';
            ctx.fillRect(this.camerabox.position.getX() - this.camerabox.width / 2,
                this.camerabox.position.getY() - this.camerabox.height / 2,
                this.camerabox.width,
                this.camerabox.height);
        }

    }

    drawDirection() {
        let mn = this.direction.normalize();
        mn.multiplyBy(this.directionLenth);

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.moveTo(this.position.getX(), this.position.getY());
        ctx.lineTo(this.position.getX() + mn.getX(), this.position.getY() + mn.getY());
        ctx.strokeStyle = '#1AA7EC';
        ctx.stroke();
    }

    drawForce() {
        if (game.isMouseDown) {
            let mn = this.forceMouseDown.normalize();
            let f = this.forceMouseDown.addValBy(10).multiplyBy(0.2).getLength();
            if (f > this.maxForceDistanceEvaluator)
                f = this.maxForceDistanceEvaluator;

            ctx.beginPath();
            ctx.moveTo(this.position.getX(), this.position.getY());
            // ctx.lineTo(this.position.getX() + mn.getX() * f, this.position.getY() - 5   );
            ctx.lineTo(this.position.getX() + mn.getX() * f, this.position.getY() + mn.getY() * f);
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = "3";
            ctx.stroke();
        }

    }
}