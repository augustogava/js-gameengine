
class Physics {
    constructor(obj) {
        this.obj = obj;
    }

    applyPhysics(forces) {
        if (!forces) {
            return;
        }

        for (let force of forces) {
            if (force.type == 1) {
                this.obj.velocity.addTo(force.value);
            } else if (force.type == 2) {
                this.obj.velocity.multiplyBy(force.value);
            }
        }
    }
     
    applyForce(force) {
        // Assuming the polygon has a mass property
        let forceAcc = force.divide(this.mass);
        this.acceleration.addTo(forceAcc);
    }

    getAngularVelocity(obj2 ) {

        const prevCenter = this.obj.getCenter();
        const delta = obj2.subtract(prevCenter);
        this.obj.translate(delta);
        const newCenter = this.obj.getCenter();
        const rotationDirection = (newCenter.getX() - prevCenter.getX()) * (obj2.getY() - prevCenter.getY()) - (newCenter.getY() - prevCenter.getY()) * (obj2.getX() - prevCenter.getX());
        return this.angularVelocity = rotationDirection * 0.01; // Adjust the multiplier as needed
    }
}

class PhysicsEngine {
    constructor(obj) {
        this.obj = obj;

        this.fixture = null;

        this.forces = [];
        this.forcesHash = new HashTable();
        this.gravity = new Vector(0, 0.55);
        this.linearDamping = 0.8;
        this.angularDamping = 0.95;

        this.bounce = 1;
        this.enabled = true;
    }
    
    status(){
        return this.enabled;
    }

    toogleStatus(){
        this.enabled =  !this.enabled;
    }
    
    addForce(n, v) {
        this.forcesHash.set(n, new Force(v));
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

    // getForce(n){
    //     if( !this.forces ){
    //         return ;
    //     }

    //     this.
    // }

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