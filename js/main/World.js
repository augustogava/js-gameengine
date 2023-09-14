
class World {
    constructor(name) {
        this.name = name
        this.bodies = [];

        this.physicsWorld = new PhysicsEngine(this);

        this.physicsWorld.addForce("friction", {
            "name": "friction",
            "type": 2,
            "value": .97
        });
        
        // this.physicsWorld.addForce("gravity", {
        //     "name": "gravity",
        //     "type": 1,
        //     "value": new Vector(0, .55)
        // });


    }

    toogleGravity(){
        return !this.physicsWorld.toogleStatus();
    }

    createWorld() {
        this.world = true;
    }

    addObject(obj) {
        this.bodies.push(obj);
    }

    getObjects() {
        return this.bodies;
    }

    update(deltaTime) {
        for (let body of this.bodies) {
            body.applyPhysics(this.physicsWorld.getForces());
            body.step(deltaTime);
        }
    }

    draw() {
        for (let body of this.bodies) {
            body.drawStep();
        }
    }

    verifyCollision() {
        if( !this.bodies ){
            return ;
        }

        if (Globals.isCollisions()) {
            for (let body of this.bodies) {
                for (let otherBody of this.bodies) {
                    if (body.id !== otherBody.id) {
                        body.checkCollisionWith(otherBody);
                    }
                }
            }
        }
    }
}