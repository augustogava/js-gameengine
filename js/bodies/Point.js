class Point {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.prevPosition = new Vector(x, y);
        this.acceleration = new Vector();
        this.mass = 1;
    }

    applyForce(force) {
        this.acceleration.add(force.multiply(1 / this.mass));
    }

    integrate(deltaTime) {
        let temp = this.position.clone();
        this.position.add(this.position.subtract(this.prevPosition).add(this.acceleration.multiply(deltaTime * deltaTime)));
        this.prevPosition = temp;
        this.acceleration.multiply(0);  // reset acceleration
    }
}
