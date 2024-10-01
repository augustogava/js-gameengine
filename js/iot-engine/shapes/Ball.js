class Ball extends BodyDef {
    constructor(rocketFake, mass, radius, position) {
        super(Ball, mass, position);
        this.rocketFake = rocketFake;
        this.physics = new Physics(this);

        this.color = "black";
        this.setBodyType('dynamic');

        this.shape = new Circle(new Vector(position.x, position.y), radius);

        this.bounce = 0;
        this.friction = 0.99;
        this.elasticity = 0.85;

        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.inv_m = (this.mass === 0) ? 0 : (1 / this.mass);

    }

    update(deltaTime) {
        let gravity = new Vector(0, 0.55);  // Gravity acceleration
        this.acceleration.addTo(gravity);  // Apply gravity directly to acceleration

        // Apply friction if near the ground
        this.physics.applyFriction(this.friction);

        this.reposition();
    }

    reposition() {
        this.velocity = this.velocity.add(this.acceleration);

        this.shape.position.addTo(this.velocity);

        this.acceleration = new Vector(0, 0);
    }

    draw() {
        if (this.shape && this.shape.position instanceof Vector) {
            this.shape.draw();
        } else {
            console.error("Shape or shape position is invalid.");
        }
    }

    display() {
        if (this.velocity && this.shape && this.shape.position instanceof Vector) {
            this.velocity.drawVec(this.shape.position.getX(), this.shape.position.getY(), 10, "green");

            ctx.fillStyle = "red";
            ctx.fillText("m = " + this.mass, this.shape.position.getX() - 10, this.shape.position.getY() - 5);
            ctx.fillText("e = " + this.elasticity, this.shape.position.getX() - 10, this.shape.position.getY() + 5);
        }
    }

    accel(v) {
        if (this.acceleration) {
            this.acceleration.addTo(new Vector(v, 0));
        }
    }

    getSpeed() {
        return this.acceleration ? this.acceleration.getLength() : 0;
    }

    getSpeed2() {
        return this.velocity ? this.velocity.getLength() : 0;
    }

    containsPoint(point) {
        if (!this.shape || !(this.shape.position instanceof Vector)) {
            console.error("Shape or shape position is not a valid Vector in containsPoint method.");
            return false;
        }

        if (!(point instanceof Vector)) {
            console.error("Point passed to containsPoint is not a valid Vector.");
            return false;
        }

        return this.shape.position.distance(point) <= this.shape.radius;
    }


    userAction() {
        if (eventshelper.keyCode) {
            if (eventshelper.keyCode === 'ArrowLeft') {
                this.acceleration.addTo(new Vector(-1, 0));
            }

            if (eventshelper.keyCode === 'ArrowRight') {
                this.acceleration.addTo(new Vector(1, 0));
            }

            if (eventshelper.keyCode === 'ArrowUp') {
                this.acceleration.addTo(new Vector(0, -1));
            }

            if (eventshelper.keyCode === 'ArrowDown') {
                this.acceleration.addTo(new Vector(0, 1));
            }
        }

        if (this.isDragging()) {
            this.acc.x = 0;
            this.acc.y = 0;

            this.velocity.x = 0;
            this.velocity.y = 0;
            this.shape.position = eventshelper.mousePos;
        }

        if (eventshelper.mouseClickDown()) {
            this.initBoost();

        }

        if (eventshelper.mouseRelease()) {
            this.applyBoost();
        }
    }

    getInputFieldsConfig() {
        return {
            'Circle': [
                {id: 'radius', label: 'Radius', type: 'number', value: this.shape.radius},
                {id: 'mass', label: 'Mass', type: 'number', value: this.mass},
                {id: 'elasticity', label: 'Elasticity', type: 'number', value: this.elasticity},
                {id: 'positionX', label: 'Position X', type: 'number', value: this.shape.position.getX()},
                {id: 'positionY', label: 'Position Y', type: 'number', value: this.shape.position.getY()}
            ]
        };
    }

    updateFieldUserInstance(property, value) {
        this.updateFieldDynamic(property, value);
    }

    updateFieldDynamic(changedField, newValue) {
        if (this.hasOwnProperty(changedField)) {
            this[changedField] = newValue;
        } else {
            if (changedField === "radius") {
                this.shape.radius = newValue;
            }
            if (changedField === "positionX" && this.shape.position instanceof Vector) {
                this.shape.position.x = newValue;
            }
            if (changedField === "positionY" && this.shape.position instanceof Vector) {
                this.shape.position.y = newValue;
            }
        }

        // this.updateConstraints();
    }

    updateConstraints() {
        if ((this.shape.position.y + this.shape.radius) > canvas.height) {
            this.shape.position.y = canvas.height - this.shape.radius;
            this.velocity.y = -Math.abs(this.velocity.y);

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.shape.position.y - this.shape.radius < 0) {
            this.shape.position.y = this.shape.radius;
            this.velocity.y = Math.abs(this.velocity.y);

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.shape.position.x + this.shape.radius > canvas.width) {
            this.shape.position.x = canvas.width - this.shape.radius;
            this.velocity.x = -Math.abs(this.velocity.x);

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.shape.position.x - this.shape.radius < 0) {
            this.shape.position.x = this.radius;
            this.velocity.x = Math.abs(this.velocity.x);

            this.velocity.multiplyBy(this.elasticity);
        }
    }

    intersects(otherBall) {
        let distanceBetweenCenters = this.shape.position.distance(otherBall.shape.position);
        let sumOfRadii = this.shape.radius + otherBall.shape.radius;

        return distanceBetweenCenters < sumOfRadii;  // True if circles are overlapping

    }
    resolveCollision(otherBall) {
        let normal = this.shape.position.subtract(otherBall.shape.position);  // Vector from other ball to this ball
        let distance = normal.getLength();

        // If the circles are overlapping
        if (distance < this.shape.radius + otherBall.shape.radius) {
            // Calculate the overlap distance
            let overlap = (this.shape.radius + otherBall.shape.radius) - distance;

            // Normalize the normal vector
            normal = normal.divide(distance);

            // Separate the circles by the overlap distance
            let correction = normal.multiplyBy(overlap / (this.inv_m + otherBall.inv_m) * 0.5);  // Split the correction proportionally based on masses

            // Correct the positions of both balls
            this.shape.position = this.shape.position.add(correction.multiplyBy(this.inv_m));
            otherBall.shape.position = otherBall.shape.position.subtract(correction.multiplyBy(otherBall.inv_m));

            // Calculate relative velocity
            let relativeVelocity = this.velocity.subtract(otherBall.velocity);
            let velocityAlongNormal = relativeVelocity.dot(normal);

            // Do not resolve if the circles are moving apart
            if (velocityAlongNormal > 0) return;

            // Calculate restitution (elasticity)
            let restitution = Math.min(this.elasticity, otherBall.elasticity);

            // Calculate the impulse scalar
            let impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
            impulseMagnitude /= (this.inv_m + otherBall.inv_m);

            // Apply impulse to both balls
            let impulse = normal.multiplyBy(impulseMagnitude);
            this.velocity = this.velocity.add(impulse.multiplyBy(this.inv_m));
            otherBall.velocity = otherBall.velocity.subtract(impulse.multiplyBy(otherBall.inv_m));
        }
    }

}
