class Physics {
    constructor(obj) {
        this.obj = obj;
        this.mass = obj.mass;
        this.acceleration = new Vector(0, 0);
    }

    applyForce(force) {
        const forceAcc = force.divide(this.mass);
        this.obj.acceleration.addTo(forceAcc);
    }

    applyFriction(mu) {
        if (this.obj.isOnGround && this.obj.ground) {
            let normal = new Vector(Math.sin(this.obj.ground.angle), -Math.cos(this.obj.ground.angle));
            let frictionDirection = this.obj.velocity.clone().normalize().multiplyBy(-1);
            let frictionMagnitude = mu * this.mass * 0.55;
            let frictionForce = frictionDirection.multiplyBy(frictionMagnitude);
            this.applyForce(frictionForce);
        }
    }

}


class PhysicsEngine {
    constructor(obj) {
        this.obj = obj;
        this.forcesHash = new HashTable();
        this.forces = [];
        this.enabled = true;
    }
    status() {
        return this.enabled;
    }

    toogleStatus() {
        this.enabled = !this.enabled;
    }


    addForce(name, force) {
        this.forcesHash.set(name, new Force(force));
    }

    getForce(name) {
        if (!this.woforcesHashlds) {
            return [];
        }

        if (!this.forcesHash.get(name)) {
            return [];
        }

        return this.forcesHash.get(name);
    }

    getForces() {
        return this.forcesHash.getAllObjcts();
    }

    applyForces(body) {
        const forces = this.getForces();

        for (let force of forces) {
            if (force.type === 1) {
                body.applyForce(force.value);
            } else if (force.type === 2) {
                body.velocity.multiplyBy(force.value);
            }
        }
    }
}

class Force {
    constructor(data) {
        this.name = data.name;
        this.type = data.type;
        this.value = data.value;
        this.seq = data?.seq;

        return this;
    }
}












