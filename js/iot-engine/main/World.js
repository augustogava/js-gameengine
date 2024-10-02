class World {
    constructor(name) {
        this.name = name
        this.BODIES = [];
        this.COLLISIONS = [];

        this.physicsWorld = new PhysicsEngine(this);
        this.physicsComplex = new PhysicsComplex();
        // this.physicsWorld.addForce("friction", {
        //     name: "friction",
        //     type: 2,
        //     value: 0.98
        // });

        // this.physicsWorld.addForce("gravity", {
        //     name: "gravity",
        //     type: 1,
        //     value: new Vector(0, 0.55)
        // });
    }

    addObject(obj) {
        this.BODIES.push(obj);
    }

    getObjects() {
        return this.BODIES;
    }

    update(deltaTime) {
        for (let body of this.BODIES) {
            this.physicsWorld.applyForces(body);
        }

        for (let body of this.BODIES) {
            body.step(deltaTime);
        }

        this.verifyCollision();
    }

    draw() {
        for (let body of this.BODIES) {
            body.drawStep();
        }
    }

    toogleGravity() {
        return !this.physicsWorld.toogleStatus();
    }

    createWorld() {
        this.world = true;
    }

    verifyCollision() {
        if (!this.BODIES) {
            return;
        }

        if (Globals.isCollisions()) {
            this.COLLISIONS.length = 0;

            for (let i = 0; i < this.BODIES.length; i++) {
                for (let j = i + 1; j < this.BODIES.length; j++) {
                    let bodyA = this.BODIES[i];
                    let bodyB = this.BODIES[j];

                    if (bodyA.id !== bodyB.id) {
                        let collisionDetected = bodyA.checkCollisionWith(bodyB);
                        if (collisionDetected) {
                            this.resolveCollision(bodyA, bodyB);
                        }
                    }
                }
            }

            // for (let body of this.BODIES) {
            //     for (let otherBody of this.BODIES) {
            //         if (body.id !== otherBody.id && body && otherBody) {
            //             let bestSat = {
            //                 pen: null,
            //                 axis: null,
            //                 vertex: null
            //             }
            //
            //             if (this.physicsComplex.sat(body.shape, otherBody.shape).pen > bestSat.pen) {
            //                 bestSat = this.physicsComplex.sat(body.shape, otherBody.shape);
            //                 ctx.fillText("COLLISION", 500, 400);
            //             }
            //
            //             if (bestSat.pen !== null) {
            //                 this.COLLISIONS.push(new CollData(body, otherBody, bestSat.axis, bestSat.pen, bestSat.vertex));
            //             }
            //
            //         }
            //     }
            // }
            //
            // if (this.COLLISIONS.length > 0) {
            //     this.COLLISIONS.forEach((c) => {
            //         c.penRes();
            //         c.collRes();
            //     });
            // }
        }
    }

    resolveCollision(bodyA, bodyB) {
        bodyA.resolveCollision(bodyB);
    }
}