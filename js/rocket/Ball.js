class Ball extends BodyDef {
    constructor(rocketFake, position) {
        super(Ball, 100, position, null, null, null);
        this.gamePhysics = new Physics(this);
        this.setBodyType('dynamic');
        this.createShape('circle');
        this.rocketFake = rocketFake;
        this.radius = 40;
        this.rotation = 0

        this.forceCalculated = 0;
        this.maxForceDistanceEvaluator = 40;
        this.directionLenth = 130;
        this.color = "black";
        this.force = new Vector(0, 0);
        this.directionBoost = new Vector(0, 0);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.init();
    }

    reset() {
        this.init();
    }

    init() {
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    intersects(otherShape) {
        if (otherShape.shape instanceof PolygonShape) {
            let d = CollisionFlat.intersectCirclePolygon(this.position, this.radius, otherShape.getCenter(), otherShape.vertices);
            if (d.normal != null) {
                CollisionFlat.resolveCollision(this, otherShape, d.normal, d.depth);
            }
        } else if (otherShape.shape instanceof Circle) {
            let d = CollisionFlat.intersectCircles(this.position, this.radius, otherShape.position, otherShape.radius);
            if (d.normal != null) {
                CollisionFlat.resolveCollision(this, otherShape, d.normal, d.depth);
            }
        }
    }

    resolveCollision(otherShape) {
        if (otherShape.shape instanceof Circle) {
            // CollisionFlat.resolveCollision(otherShape);
        } else if (otherShape.shape instanceof PolygonShape) {
            console.log("col shape")
            return this.resolveCollisionWithPolygon(otherShape);
        }
    }

    resolveCollisionWithPolygon(polygon) {
        let smallestOverlap = Infinity;
        let smallestAxis = null;

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

        if (smallestAxis) {
            let centerPolygon = polygon.getCenter();
            let directionToPolygon = this.position.subtract(centerPolygon).normalize();

            if (smallestAxis.dot(directionToPolygon) < 0) {
                smallestAxis = smallestAxis.multiply(-1);
            }

            let impulse = smallestAxis.multiply(smallestOverlap * 2);
            let circleMass = this.mass || 1;
            let polygonMass = polygon.mass || 1;
            let totalMass = circleMass + polygonMass;

            this.velocity.addTo(impulse.multiply(polygonMass / totalMass));
            polygon.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
        }
    }

    collidesWithPolygon(polygon) {
        if (polygon.containsPoint(this.position)) {
            return true;
        }

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

    applyBoost() {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }
        let f = this.forceMouseDown.multiplyBy(1).getLength();
        if (f > this.maxForceDistanceEvaluator)
            f = this.maxForceDistanceEvaluator;

        this.forceCalculated = Math.abs(f);
        if (this.forceCalculated <= 9 || !this.direction) {
            this.forceCalculated = 0;
            this.boost = false;
            return;
        }

        if (this.forceCalculated > this.maxForceDistanceEvaluator) {
            this.forceCalculated = this.maxForceDistanceEvaluator;
        }

        let mn = this.direction.normalize();
        mn.multiplyBy(this.forceCalculated);

        this.velocity.addTo(mn.multiplyBy(1));
        this.forceCalculated = 0;
        this.boost = false;
        this.rocketFake.selectedBody = false;
    }

    initBoost() {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }

        this.directionBoost = eventshelper.mousepos.subtract(this.position);
        this.boost = true;
    }

    userAction() {
        if (eventshelper.keycode) {

            if (eventshelper.keycode === 'ArrowLeft') {
                this.movement.addTo(new Vector(-1, 0));
            }

            if (eventshelper.keycode === 'ArrowRight') {
                this.movement.addTo(new Vector(1, 0));
            }

            if (eventshelper.keycode === 'ArrowUp') {
                this.movement.addTo(new Vector(0, -1));
            }

            if (eventshelper.keycode === 'ArrowDown') {
                this.movement.addTo(new Vector(0, 1));
            }

            if (eventshelper.keycode === 'KeyD') {
                this.throttle = true;
                this.break = false;
                this.accel(this.rocketFake.speed);
            }

            if (eventshelper.keycode === 'KeyA') {
                this.throttle = true;
                this.break = false;
                this.accel(-this.rocketFake.speed);
            }

            if (eventshelper.keycode === 'KeyS') {
                this.throttle = false;
                this.break = true;
            }
        }

        if (eventshelper.mouseClickDown()) {
            this.initBoost();
        }

        if (eventshelper.mouseRelease()) {
            this.applyBoost();
        }
    }

    update(deltaTime) {
        // this.updateBodyDef();

        if (this.movement.getX() != 0 || this.movement.getY() != 0) {
            let movementForceDirection = this.movement.normalize();
            let force = movementForceDirection.multiply(.7);
            this.velocity.addTo(force);
        }

        // this.velocity.addTo(new Vector(0, .55) );

        // this.velocity.multiplyBy(this.friction);
        // this.velocity.addTo(this.acceleration);
        this.position.addTo(this.velocity);

        this.rotation += this.rotationalVelocity;

        // this.velocity.addTo(this.acceleration);
        // this.position.addTo(this.velocity);
        this.direction = eventshelper.mousepos.subtract(this.position);
        this.force = eventshelper.mousepos.subtract(this.position);
        this.forceMouseDown = eventshelper.mousepos.subtract(eventshelper.lastmousepos_down);

        this.lastPosition = this.position;

        this.updateConstraints()
    }

    draw() {
        // ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        if (this.imgLoad) {
            ctx.drawImage(this.img, 0, 0);
        }

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

            if (this.camerabox) {
                ctx.fillStyle = 'rgba(0,0,255,0.2)';
                ctx.fillRect(this.camerabox.position.getX() - this.camerabox.width / 2,
                    this.camerabox.position.getY() - this.camerabox.height / 2,
                    this.camerabox.width,
                    this.camerabox.height);
            }
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
        if (eventshelper.mousePressingDown()) {
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