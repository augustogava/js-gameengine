class World {
    constructor(gravity) {
        this.gravity = gravity;
        this.bodies = [];
        this.globalDamping = 0.98;
    }

    rectangles = [];  // Add this to hold all rectangular bodies

    addRectangle(rect) {
        this.rectangles.push(rect);
    }

    addBody(body) {
        this.bodies.push(body);
    }

    step(deltaTime) {
        for (let body of this.bodies) {
            for (let point of body.points) {
                point.applyForce(this.gravity.multiply(point.mass));
                point.integrate(deltaTime);

                this.handleCollisions(point);
            }

            body.solveConstraints();
        }
    }

    handleCollisions(point) {
        for (let rect of this.rectangles) {
            if (rect.contains(point.position)) {
                // Adjust point's position based on the nearest edge
                let leftDist = point.position.x - rect.x;
                let rightDist = (rect.x + rect.width) - point.position.x;
                let topDist = point.position.y - rect.y;
                let bottomDist = (rect.y + rect.height) - point.position.y;

                let minDist = Math.min(leftDist, rightDist, topDist, bottomDist);

                if (minDist === leftDist) {
                    point.position.x = rect.x;
                } else if (minDist === rightDist) {
                    point.position.x = rect.x + rect.width;
                } else if (minDist === topDist) {
                    point.position.y = rect.y;
                } else {
                    point.position.y = rect.y + rect.height;
                }

                // Bounce the point back (simple reflection here)
                if (minDist === leftDist || minDist === rightDist) {
                    point.prevPosition.x = -point.prevPosition.x;
                } else {
                    point.prevPosition.y = -point.prevPosition.y;
                }
            }
        }
    }

}



function render(world) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let body of world.bodies) {
        for (let point of body.points) {
            ctx.beginPath();
            ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    for (let rect of world.rectangles) {
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
}

let world = new World(new Vector(0, 9.8));
let body = new SoftBody(100, 100, 5, 20, 0.1);
world.addBody(body);

let rectangle = new Rect(150, 150, 100, 50);
world.addRectangle(rectangle);

function animate() {
    world.step(0.016);  // 60fps time step
    render(world);
    requestAnimationFrame(animate);
}

animate();
