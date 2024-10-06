class BodyDef {
    constructor(instance, mass, position, speed, direction) {

        this.id = Utils.randomIntFromInterval(1, 5000);
        this.currentTime = Date.now();
        this.physics = new Physics(this);
        this.setBodyType('static');

        this.mass = mass ? mass : 1;
        this.invMass = (this.mass === 0) ? 0 : (1 / this.mass);

        this.fixtures = [];

        this.instance = instance;

        this.colorOriginal = "rgba(0,0,0, 1)";
        this.colorUserSelected = "red";

        this.color = this.colorOriginal;
        this.colorProjection = Utils.changeRedSoftness(this.color, 200);
        this.colorShadow = Utils.changeRedSoftness(this.color, 0);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.density = 1;
        this.bounce = 0;
        this.friction = 0.2;
        this.elasticity = 0.5;
        this.mu = 0.1;
        this.restitution = 1;

        this.velocity = new Vector(0, 0);
        this.angularVelocity = 0;

        this.rotation = 0;
        this.position = position;
        this.positionOld = position;

        this.direction = new Vector(0, 0);

        this.acceleration = new Vector(0, 0);
        this.accelerationHelper = new Vector(0, 0);
        this.acc = Vector.$();
        this.movement = new Vector(0, 0);

        this.inv_m = 0;
        this.inertia = 0;
        this.inv_inertia = 0;
        this.angVel = 0;

        this.isOnGround = false;
        this.ground = null;

        if (speed)
            this.velocity.setLength(speed);

        if (direction)
            this.velocity.setAngle(direction);

        this.worldStuffEnabled = true;
    }

    addFixture(fixture) {
        this.fixtures.push(fixture);
    }

    step(d) {
        if (Utils.existsMethod(this.update)) {
            this.update(d)
        } else if (this.shape && Utils.existsMethod(this.shape.update)) {
            // this.shape.update(d)
        }

        if (typeof this.updatecamerabox === "function") {
            this.updatecamerabox(d);
        }

        // if (Globals.isAttraction()) {
        //     obj.attract();
        // }

        if (Globals.getBoundaries()) {
            this.updateConstraintsStep();
        }

        this.verifyActions();
    }

    drawStep() {
        this.drawSuper();

        if (this.shape && Utils.existsMethod(this.shape.draw)) {
            this.shape.draw();
        }

        if (Utils.existsMethod(this.draw)) {
            this.draw();
        }

        if (Globals.isDebug()) {
            if (Utils.existsMethod(this.debug)) {
                // this.debug();
            }
            if (Utils.existsMethod(this.shape.debug)) {
                this.shape.debug();
            }

            if (Utils.existsMethod(this.shape.display)) {
                this.shape.display();
            }
        }
    }

    // updatecamerabox() {
    //     if (this.camerabox) {
    //         this.camerabox = {
    //             position: new Vector(this.position.getX(), this.position.getY()),
    //             width: canvas.width / 2.3,
    //             height: this.camerabox.height
    //         }
    //     }
    // }

    addFixture(fixture) {
        this.fixtures.push(fixture);
    }

    updatePhysicsBody() {

    }

    updatecamerabox() {
        if (this.camerabox) {
            this.camerabox = {
                position: new Vector(this.position.getX(), this.position.getY()),
                width: canvas.width / 2.3,
                height: this.camerabox.height
            }

            this.rocketFake.camera.updateCameraPlayer(this);
        }
    }

    verifyActions() {
        if (this.isSelected()) {
            if (typeof this.userAction === "function") {
                this.userAction();
            }
        }
    }

    isSelected() {
        if (!this.rocketFake) {
            return false;
        }

        if (this === this.rocketFake.selectedBody || (this.shape && this.shape.polygon && this.shape.polygon === this.rocketFake.selectedBody)) {
            return true;
        }

        return false;
    }

    isDragging() {
        if (!this.isSelected()) {
            return false;
        }
        return eventshelper.mousePressingDown();
    }

    applyForce(force) {
        let forceAcc = force.divide(this.mass);
        this.acceleration.addTo(forceAcc);
    }

    applyPhysics(g) {
        if (!this.physics /*|| !this.worldStuffEnabled */) {
            return;
        }

        this.physics.applyForceCalculated(1, g);
    }

    setBodyType(btr) {
        this.bodyType = new BodyDefType(btr);
    }

    createShape(shape, s = null) {
        this.shape = ShapeFactory.createShape(shape, s);
    }

    createFixture(fix) {
        this.fixture = fix;
    }

    updateBodyDef() {
        for (let fixture of this.fixtures) {
            this.velocity.multiplyBy(fixture.friction);
        }
    }

    updateConstraintsStep() {
        if (Utils.existsMethod(this.updateConstraints)) {
            this.updateConstraints();
        }
    }

    checkCollisionWith(otherBody) {
        for (let fix1 of this.fixtures) {
            for (let fix2 of otherBody.fixtures) {
                if (fix1.collidesWith(fix2)) {
                    fix1.solveCollision(fix2);
                }
            }
        }
    }

    getCenter() {
        if (!this.shape || !Utils.existsMethod(this.shape.getCenter)) {
            return Vector.$();
        }

        return this.shape.getCenter();
    }

    drawSuper() {
        if (!this.rocketFake) {
            return;
        }

        if (this.isSelected()) {
            this.color = this.colorUserSelected;

            ctx.fillStyle = this.colorUserSelected;
            ctx.strokeStyle = this.colorUserSelected;
        } else {
            this.color = this.colorOriginal;

            ctx.fillStyle = this.colorOriginal;
            ctx.strokeStyle = this.colorOriginal;
        }
    }

    getSpeedByPosition() {
        return this.position.subtract(this.positionOld);
    }

    updateFieldUser(last, v) {
        if (this.shape && typeof this.shape.updateFieldUserInstance === "function") {
            this.shape.updateFieldUserInstance(last, v);
        } else {
            if (typeof this.updateFieldUserInstance === "function") {
                this.updateFieldUserInstance(last, v);
            }
        }
    }
    predictNextPosition(deltaTime) {
        return this.shape.position.add(this.velocity.multiply(deltaTime));
    }

    addCamera() {
        this.camerabox = Camera.createCameraBox({
            position: new Vector(this.position.getX(), this.position.getY()),
            width: 600,
            height: 300
        });
    }

    intersects(otherShape) {
        return false;
    }
}