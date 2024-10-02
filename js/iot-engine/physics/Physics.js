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
        let diff = canvas.height - (this.obj.shape.position.y + this.obj.shape.radius);
        if (diff < 1) {
            let friction = this.obj.velocity.clone();
            friction = friction.normalize();
            friction= friction.multiplyBy(-1);

            let normal = this.mass;
            friction.setLength(mu * normal);

            this.applyForce(friction);
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

    addForce(name, force) {
        this.forcesHash.set(name, new Force(force));
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
