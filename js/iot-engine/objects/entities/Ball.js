class Ball extends BodyDef {
    constructor(rocketFake, mass, radius, position) {
        super(Ball, mass, position);
        this.setBodyType('dynamic');

        this.rocketFake = rocketFake;
        this.physics = new Physics(this);
        this.color = "black";
        this.shape = new Circle(new Vector(position.x, position.y), radius);

        this.bounce = 0;
        this.friction = 0.1;
        this.elasticity = .5;

        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.inv_m = (this.mass === 0) ? 0 : (1 / this.mass);

        this.isOnGround = false;
        this.ground = null;
    }

    update(deltaTime) {
        this.isOnGround = false;
        this.ground = null;

        let gravity = new Vector(0, 0.55);
        this.acceleration = gravity.clone();

        if (this.isOnGround && this.ground) {
            let groundAngle = this.ground.angle;
            let gravityMagnitude = gravity.getLength();
            let gravityAlongPlane = gravityMagnitude * Math.sin(groundAngle);
            let gravityVectorAlongPlane = new Vector(Math.cos(groundAngle), Math.sin(groundAngle)).multiplyBy(gravityAlongPlane);
            this.acceleration.addTo(gravityVectorAlongPlane);
        }

        if (this.isOnGround) {
            this.physics.applyFriction(this.friction);
        }

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

            // this.shape.position.drawVec(this.shape.position.x, this.shape.position.y, 1, `black`);

        } else {
            console.error("Shape or shape position is invalid.");
        }
    }

    display() {
        // if (this.velocity && this.shape && this.shape.position instanceof Vector) {
        //     this.velocity.drawVec(this.shape.position.getX(), this.shape.position.getY(), 10, "green");
        //
        //     ctx.fillStyle = "red";
        //     ctx.fillText("m = " + this.mass, this.shape.position.getX() - 10, this.shape.position.getY() - 5);
        //     ctx.fillText("e = " + this.elasticity, this.shape.position.getX() - 10, this.shape.position.getY() + 5);
        // }
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

            if( eventshelper.mousePos )
                this.shape.position = new Vector(eventshelper.mousePos.x, eventshelper.mousePos.y);
        }

        if (eventshelper.mouseClickDown()) {
            // let wind = createVector(0.1, 0);
            // drawVector(wind, mover.pos.x, mover.pos.y, color(0, 0, 255), 100);
            // mover.applyForce(wind, color(0, 0, 255));
        }

        if (eventshelper.mouseRelease()) {
            // this.applyBoost();
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
    }

    updateConstraints() {
        if ((this.shape.position.y + this.shape.radius) > canvas.height) {
            this.shape.position.y = canvas.height - this.shape.radius;
            this.velocity.y *= -this.elasticity;
            this.velocity.x *= (1 - this.friction);
        }

        if ((this.shape.position.y - this.shape.radius) < 0) {
            this.shape.position.y = this.shape.radius;
            this.velocity.y *= -this.elasticity;
        }

        if ((this.shape.position.x + this.shape.radius) > canvas.width) {
            this.shape.position.x = canvas.width - this.shape.radius;
            this.velocity.x *= -this.elasticity;
        }

        if ((this.shape.position.x - this.shape.radius) < 0) {
            this.shape.position.x = this.shape.radius;
            this.velocity.x *= -this.elasticity;
        }

        if (this.ground) {
            let belowDistance = this.ground.below(this.shape.position, this.shape.radius);
            if (belowDistance > 0) {
                this.shape.position.y -= belowDistance;
                this.velocity.y *= -this.elasticity;
            }
        }
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
        if (ground.below(this.shape.position, this.shape.radius) < 25) {
            let diff = ground.below(this.shape.position, this.shape.radius);
            return diff > -1;
        }
    }

    resolveCollision(otherShape) {
        if (otherShape.shape instanceof Circle) {
            return this.resolveCollisionWithCircle(otherShape);
        } else if (otherShape instanceof Ground) {
            return this.resolveCollisionWithGroundV2(otherShape);
        }
    }

    resolveCollisionWithCircle(otherBall) {
        let normal = this.shape.position.subtract(otherBall.shape.position);
        let distance = normal.getLength();
        let minDistance = this.shape.radius + otherBall.shape.radius;

        if (distance < minDistance) {
            let overlap = minDistance - distance;

            normal = normal.divide(distance);

            let totalInvMass = this.inv_m + otherBall.inv_m;
            this.shape.position = this.shape.position.add(normal.multiplyBy(overlap * (this.inv_m / totalInvMass)));
            otherBall.shape.position = otherBall.shape.position.subtract(normal.multiplyBy(overlap * (otherBall.inv_m / totalInvMass)));

            let relativeVelocity = this.velocity.subtract(otherBall.velocity);
            let velocityAlongNormal = relativeVelocity.dot(normal);

            if (velocityAlongNormal > 0) return;

            let restitution = Math.min(this.elasticity, otherBall.elasticity);

            let impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
            impulseMagnitude /= totalInvMass;

            let impulse = normal.multiplyBy(impulseMagnitude);

            this.velocity = this.velocity.add(impulse.multiplyBy(this.inv_m));
            otherBall.velocity = otherBall.velocity.subtract(impulse.multiplyBy(otherBall.inv_m));
        }
    }

    resolveCollisionWithGroundV2(ground) {
        let belowDistance = ground.below(this.shape.position, this.shape.radius);
        if (belowDistance > 0) {
            this.isOnGround = true;
            this.ground = ground;

            this.shape.position.y -= belowDistance;

            let normal = new Vector(Math.sin(ground.angle), -Math.cos(ground.angle));
            let tangent = new Vector(Math.cos(ground.angle), Math.sin(ground.angle));

            let v = this.velocity;
            let vn = normal.multiplyBy(v.dot(normal));
            let vt = v.subtract(vn);

            let vn_new = vn.multiplyBy(-this.elasticity);
            let vt_new = vt.multiplyBy(1 - this.friction);

            this.velocity = vn_new.add(vt_new);

            let acc_normal = normal.multiplyBy(this.acceleration.dot(normal));
            this.acceleration = this.acceleration.subtract(acc_normal);
        }
    }

    resolveCollisionWithGround(ground) {
        let below = ground.below(this.shape.position, this.shape.radius);
        if (below > 0) {
            this.isOnGround = true;
            this.ground = ground;

            let normal = new Vector(Math.sin(ground.angle), -Math.cos(ground.angle));
            let tangent = new Vector(Math.cos(ground.angle), Math.sin(ground.angle));

            this.shape.position = this.shape.position.add(normal.multiplyBy(below));

            let v = this.velocity;
            let vn = normal.multiplyBy(v.dot(normal));
            let vt = v.subtract(vn);

            let vn_new = vn.multiplyBy(-this.elasticity);

            let vt_new = vt.multiplyBy(1 - this.friction);

            this.velocity = vn_new.add(vt_new);

            let acc_normal = normal.multiplyBy(this.acceleration.dot(normal));
            this.acceleration = this.acceleration.subtract(acc_normal);
        }
    }
}