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
        this.mu = 0.1;

        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.inv_m = (this.mass === 0) ? 0 : (1 / this.mass);

    }

    update(deltaTime) {
        let gravity = new Vector(0, 0.55);
        this.acceleration.addTo(gravity);

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

            this.shape.position.drawVec(null, null, 4, `black`);

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
            // let wind = createVector(0.1, 0);
            // drawVector(wind, mover.pos.x, mover.pos.y, color(0, 0, 255), 100);
            // mover.applyForce(wind, color(0, 0, 255));
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
            this.velocity.y *= -1;

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.shape.position.y - this.shape.radius < 0) {
            this.shape.position.y = this.shape.radius;
            this.velocity.y *= -1;

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.shape.position.x >= canvas.width - this.shape.radius) {
            this.shape.position.x = canvas.width - this.shape.radius;
            this.velocity.x *= -1;
        } else if (this.shape.position.x <= this.shape.radius) {
            this.shape.position.x = this.shape.radius;
            this.velocity.x *= -1;
        }
        //
        // if (this.shape.position.x + this.shape.radius > canvas.width) {
        //     this.shape.position.x = canvas.width - this.shape.radius;
        //     this.velocity.x = -Math.abs(this.velocity.x);
        //
        //     this.velocity.multiplyBy(this.elasticity);
        // }
        //
        // if (this.shape.position.x - this.shape.radius < 0) {
        //     this.shape.position.x = this.radius;
        //     this.velocity.x = Math.abs(this.velocity.x);
        //
        //     this.velocity.multiplyBy(this.elasticity);
        // }
    }

    intersects(otherShape) {
        if (otherShape.shape instanceof Circle) {
            return this.collidesWithCircle(otherShape);
        } else if (otherShape instanceof Ground) {
            return this.collidesWithGround(otherShape);
        }
    }

    collidesWithCircle(otherShape) {
        let distanceBetweenCenters = this.shape.position.distance(otherShape.shape.position);
        let sumOfRadii = this.shape.radius + otherShape.shape.radius;

        return distanceBetweenCenters < sumOfRadii;
    }

    collidesWithGround(ground) {
        if (ground.below(this.shape.position, this.shape.radius)) {
            let diff = ground.below(this.shape.position, this.shape.radius);
            return diff > -1;
        }
    }

    resolveCollision(otherShape) {
        if (otherShape.shape instanceof Circle) {
            return this.resolveCollisionWithCircle(otherShape);
        } else if (otherShape instanceof Ground) {
            return this.resolveCollisionWithGround(otherShape);
        }
    }

    resolveCollisionWithCircle(otherShape) {
        let normal = this.shape.position.subtract(otherShape.shape.position);
        let distance = normal.getLength();

        if (distance < this.shape.radius + otherShape.shape.radius) {
            let overlap = (this.shape.radius + otherShape.shape.radius) - distance;

            normal = normal.divide(distance);

            let correction = normal.multiplyBy(overlap / (this.inv_m + otherShape.inv_m) * 0.5);

            this.shape.position = this.shape.position.add(correction.multiplyBy(this.inv_m));
            otherShape.shape.position = otherShape.shape.position.subtract(correction.multiplyBy(otherShape.inv_m));

            let relativeVelocity = this.velocity.subtract(otherShape.velocity);
            let velocityAlongNormal = relativeVelocity.dot(normal);

            if (velocityAlongNormal > 0) return;

            let restitution = Math.min(this.elasticity, otherShape.elasticity);

            let impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
            impulseMagnitude /= (this.inv_m + otherShape.inv_m);

            let impulse = normal.multiplyBy(impulseMagnitude);
            this.velocity = this.velocity.add(impulse.multiplyBy(this.inv_m));
            otherShape.velocity = otherShape.velocity.subtract(impulse.multiplyBy(otherShape.inv_m));
        }
    }

    resolveCollisionWithGround(ground) {
        let friction = this.velocity.clone();
        friction = friction.normalize();
        friction = friction.mult(-1);
        friction = friction.rotate(-ground.angle);

        let normal = this.mass;
        friction.setMag(this.mu * normal);
        this.applyForce(friction);
    }

}
