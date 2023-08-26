class Body {
    constructor(instance, mass, position, degrees, speed, direction) {
        this.id = Utils.randomIntFromInterval(1, 5000);

        this.color = "rgba(250,128,114, 1)";
        this.colorProjection = Utils.changeRedSoftness(this.color, 200);
        this.colorShadow = Utils.changeRedSoftness(this.color, 0);

        this.G = 667.4;
        this.mass = mass;
        this.angle = (degrees) ? (degrees * (Math.PI / 180)) : 0;
        this.angularVelocity = 0;
        this.position = position;
        this.positionOld = position;
        this.acceleration = 0;

        this.positionFixed = position;
        this.positionOldFixed = position;
        this.accelerationFixed = 0;

        this.acceleration = new Vector(0, 0);

        this.velocity = new Vector(0, 0);
        if (speed)
            this.velocity.setLength(speed);

        if (direction)
            this.velocity.setAngle(direction);

        this.velocityFixed = this.velocity;

        if (mass) {
            this.physics = new Physics(mass);
            this.physics.addForce(this.physics.gravity.multiplyBy(this.mass));
        }

        this.initiateDatetime = Date.now();

        this.debugObj = new Debug(this);
    }

    // @TODO
    createBody(shape) {
        this.shape = shape;
    }

    collidesWith(otherShape) {
        return false;
    }

    updateDegrees(d) {
        this.angle = (d) ? (d * (Math.PI / 180)) : this.angle;
    }

    updatePosition(v) {
        this.position = v;
    }

    commonsUpdate(obj) {
        obj.updateToReadbleNumber();
        if (Globals.isAttraction()) {
            obj.attract();
        }

        if (!Globals.isDebug()) {
            return;
        }
    }

    updateToReadbleNumber() {
        if (this.position)
            this.positionFixed = new Vector(this.position.x.toFixed(1), this.position.y.toFixed(1));

        if (this.positionOld)
            this.positionOldFixed = new Vector(this.positionOld.x.toFixed(1), this.positionOld.y.toFixed(1));

        if (this.velocity)
            this.velocityFixed = new Vector(this.velocity.x.toFixed(1), this.velocity.y.toFixed(1));
    }

    clone() {
        // return new Vector(this.x, this.y);
    }

}