class Physics {
    constructor(obj) {
        this.obj = obj;
        this.mass = obj.mass;  // Get the mass from the object
        this.acceleration = new Vector(0, 0);  // Object's current acceleration
    }

    applyForce(force) {
        const forceAcc = force.divide(this.mass);
        this.acceleration.addTo(forceAcc);
    }

    applyForceCalculated(forces) {
        if (!forces) return;

        for (let force of forces) {
            // Check for gravity force (type 1) or friction/damping force (type 2)
            if (force.type == 1) {
                if (this.obj.shape && this.obj.shape.velocity) {
                    this.obj.shape.velocity.addTo(force.value);  // Apply gravity
                } else {
                    this.obj.velocity.addTo(force.value);  // Apply gravity
                }
            } else if (force.type == 2) {
                if (this.obj.shape && this.obj.shape.velocity) {
                    this.obj.shape.velocity.multiplyBy(force.value);  // Apply friction
                } else {
                    this.obj.velocity.multiplyBy(force.value);  // Apply friction
                }
            }
        }
    }

    applyFriction(mu) {
        let diff = canvas.height - (this.obj.shape.position.y + this.obj.shape.radius);
        if (diff < 1) {  // Object is touching or very close to the ground
            let friction = this.obj.velocity.clone();
            friction.normalize();  // Get the direction of velocity
            friction.multiplyBy(-1);  // Reverse the direction (friction opposes motion)

            // Magnitude of friction = μ * normal force (normal force is the object's weight)
            let normal = this.mass;  // The normal force is equal to the mass in this case
            friction.setLength(mu * normal);  // Friction force = μ * normal force

            // Apply friction as a force
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
