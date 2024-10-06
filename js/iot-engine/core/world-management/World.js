class World {
    constructor(name) {
        this.name = name
        this.BODIES = [];
        this.COLLISIONS = [];

        this.physicsWorld = new PhysicsEngine(this);
        this.physicsComplex = new PhysicsComplex();
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
        if (!this.BODIES.length) {
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
        }
    }

    verifyCollisionNew() {
        if (!this.BODIES.length) {
            return;
        }

        if (Globals.isCollisions()) {
            this.COLLISIONS.length = 0;

            for (let row of this.physicsWorld.collisionGrid.data) {
                for (let cell of row) {
                    cell.clear();
                }
            }

            for (let body of this.BODIES) {
                const { x, y } = body.shape.position;
                const radius = body.shape.radius || 0;
                this.physicsWorld.collisionGrid.addAtom(x, y, radius, body);
            }

            const checkedPairs = new Set();

            for (let body of this.BODIES) {
                const { x, y } = body.shape.position;
                const radius = body.shape.radius || 0;
                const nearbyCells = this.physicsWorld.collisionGrid.getNearbyCells(x, y, radius);

                for (let cell of nearbyCells) {
                    for (let otherBody of cell.objects) {
                        if (body !== otherBody) {
                            const pairKey = body.id < otherBody.id ? `${body.id}-${otherBody.id}` : `${otherBody.id}-${body.id}`;

                            if (!checkedPairs.has(pairKey)) {
                                checkedPairs.add(pairKey);

                                if ((body.bodyType.bodyType.moved || otherBody.bodyType.bodyType.moved) &&
                                    body.checkCollisionWith(otherBody)) {
                                    this.resolveCollision(body, otherBody);
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    // verifyCollisionComplex() {
    //     if (!this.BODIES) {
    //         return;
    //     }
    //         this.COLLISIONS.length = 0;
    //
    //         for (let i = 0; i < this.BODIES.length; i++) {
    //         for (let j = i + 1; j < this.BODIES.length; j++) {
    //         let bodyA = this.BODIES[i];
    //         let bodyB = this.BODIES[j];
    //
    //         if (bodyA.id !== bodyB.id) {
    //         let collisionDetected = bodyA.checkCollisionWith(bodyB);
    //         if (collisionDetected) {
    //             this.resolveCollision(bodyA, bodyB);
    //         }
    //     }
    //     }
    //     }
    //
    //         // for (let body of this.BODIES) {
    //         //     for (let otherBody of this.BODIES) {
    //         //         if (body.id !== otherBody.id && body && otherBody) {
    //         //             let bestSat = {
    //         //                 pen: null,
    //         //                 axis: null,
    //         //                 vertex: null
    //         //             }
    //         //
    //         //             if (this.physicsComplex.sat(body.shape, otherBody.shape).pen > bestSat.pen) {
    //         //                 bestSat = this.physicsComplex.sat(body.shape, otherBody.shape);
    //         //                 ctx.fillText("COLLISION", 500, 400);
    //         //             }
    //         //
    //         //             if (bestSat.pen !== null) {
    //         //                 this.COLLISIONS.push(new CollData(body, otherBody, bestSat.axis, bestSat.pen, bestSat.vertex));
    //         //             }
    //         //
    //         //         }
    //         //     }
    //         // }
    //         //
    //         // if (this.COLLISIONS.length > 0) {
    //         //     this.COLLISIONS.forEach((c) => {
    //         //         c.penRes();
    //         //         c.collRes();
    //         //     });
    //         // }
    //     }
    // }

    resolveCollision(bodyA, bodyB) {
        bodyA.resolveCollision(bodyB);
    }
}