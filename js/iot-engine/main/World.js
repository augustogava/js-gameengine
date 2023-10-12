
class World {
    constructor(name) {
        this.name = name
        this.BODIES = [];
        this.COLLISIONS = [];


        this.physicsWorld = new PhysicsEngine(this);
        this.physicsComplex = new PhysicsComplex();

        this.physicsWorld.addForce("friction", {
            "name": "friction",
            "type": 2,
            "value": .98
        });

        this.physicsWorld.addForce("gravity", {
            "name": "gravity",
            "type": 1,
            "value": new Vector(0, .55)
        });

    }

    toogleGravity() {
        return !this.physicsWorld.toogleStatus();
    }

    createWorld() {
        this.world = true;
    }

    addObject(obj) {
        this.BODIES.push(obj);
    }

    getObjects() {
        return this.BODIES;
    }

    update(deltaTime) {
        for (let body of this.BODIES) {
            // if( body.bodyType && ( body.bodyType.moved || body.bodyType.velocity) ){
                body.applyPhysics(this.physicsWorld.getForces());
            // }
            body.step(deltaTime);
        }
    }

    draw() {
        for (let body of this.BODIES) {
            body.drawStep();
        }
    }

    verifyCollision() {
        if (!this.BODIES) {
            return;
        }
        return;

        if (Globals.isCollisions()) {
            this.COLLISIONS.length = 0;

            // for (let body of this.BODIES) {
            //     for (let otherBody of this.BODIES) {
            //         if (body.id !== otherBody.id) {
            //             body.checkCollisionWith(otherBody);
            //         }
            //     }
            // }

            for (let body of this.BODIES) {
                for (let otherBody of this.BODIES) {
                    if (body.id !== otherBody.id && body && otherBody) {
                        let bestSat = {
                            pen: null,
                            axis: null,
                            vertex: null
                        }

                        if (this.physicsComplex.sat(body.shape, otherBody.shape).pen > bestSat.pen) {
                            bestSat = this.physicsComplex.sat(body.shape, otherBody.shape);
                            ctx.fillText("COLLISION", 500, 400);
                        }

                        if (bestSat.pen !== null) {
                            this.COLLISIONS.push(new CollData(body, otherBody, bestSat.axis, bestSat.pen, bestSat.vertex));
                        }

                    }
                }
            }

            if (this.COLLISIONS.length > 0) {
                this.COLLISIONS.forEach((c) => {
                    c.penRes();
                    c.collRes();
                });
            }
        }
    }
}