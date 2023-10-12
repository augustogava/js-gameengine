
const bodyType = new HashTable();
bodyType.set('static', { mass: 0, velocity: 0, moved: 0 });
bodyType.set('dynamic', { mass: 0, velocity: 1, moved: 1 });
bodyType.set('kinematic', { mass: 1, velocity: 1, moved: 1 });

class BodyDefType {
    constructor(bodyTypeP) {
        this.bodyType = bodyType.get(bodyTypeP);
    }
}

// FlatVector position;
// FlatVector linearVelocity;
// float angle;
// float angularVelocity;
// FlatVector force;

// public readonly ShapeType ShapeType;
// public readonly float Density;
// public readonly float Mass;
// public readonly float InvMass;
// public readonly float Restitution;
// public readonly float Area;
// public readonly float Inertia;
// public readonly float InvInertia;
// public readonly bool IsStatic;
// public readonly float Radius;
// public readonly float Width;
// public readonly float Height;

// readonly FlatVector[] vertices;
// FlatVector[] transformedVertices;
// FlatAABB aabb;

// bool transformUpdateRequired;
// bool aabbUpdateRequired;

class BodyDef {
    constructor(instance, mass, position, speed, direction) {
        this.physics = null;

        this.id = Utils.randomIntFromInterval(1, 5000);
        this.currentTime = Date.now();

        this.mass = mass ? mass : 1;
        this.invMass = (this.mass === 0) ? 0 : (1 / this.mass);

        this.fixtures = [];

        this.instance = instance;

        this.colorOriginal = "rgba(0,0,0, 1)";
        this.colorUserSelected = "red";

        this.color = this.colorOriginal;''
        this.colorProjection = Utils.changeRedSoftness(this.color, 200);
        this.colorShadow = Utils.changeRedSoftness(this.color, 0);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.density = 1;
        this.friction = 1;
        this.elasticity = 1;

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
        } else if (this.shape && Utils.existsMethod(this.shapeupdate)) {
            this.shape.update(d)
        }

        if (Globals.getBoundaries()) {
            this.updateConstraints();
        }

        if (typeof this.updatecamerabox === "function") {
            this.updatecamerabox(d);
        }

        if (Globals.isAttraction()) {
            obj.attract();
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
        // console.log(this.rocketFake.selectedBody )
        if (!this.isSelected()) {
            return false;
        }

        return eventshelper.mousePressingDown();
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

    updateConstraints() {
        if (this.position.y + this.radius >= canvas.height) {
            this.position.y = canvas.height - this.radius;
            this.velocity.y = this.velocity.y * -1;

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.position.y - this.radius <= 0) {
            this.position.y = this.radius;
            this.velocity.y = this.velocity.y * -1;

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.position.x + this.radius >= canvas.width) {
            this.position.x = canvas.width - this.radius;
            this.velocity.x = this.velocity.x * -1;

            this.velocity.multiplyBy(this.elasticity);
        }

        if (this.position.x - this.radius <= 0) {
            this.position.x = 0 + this.radius;
            this.velocity.x = this.velocity.x * -1;

            this.velocity.multiplyBy(this.elasticity);
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

            ctx.fillStyle = this.colorUserSelected;// 'rgba(44, 100, 10, 1)'; // Change color for selected polygon
            ctx.strokeStyle = this.colorUserSelected;//// Change color for selected polygon
        } else {
            this.color = this.colorOriginal;

            ctx.fillStyle = this.colorOriginal;// 'rgba(44, 100, 10, 1)'; // Change color for selected polygon
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

    addCamera() {
        this.camerabox = Camera.createCameraBox({
            position: new Vector(this.position.getX(), this.position.getY()),
            width: 600,
            height: 300
        });
    }
}