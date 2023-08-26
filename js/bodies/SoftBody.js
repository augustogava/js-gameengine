class SoftBody {
    constructor(x, y, segments, spacing, stiffness) {
        this.points = [];
        this.springs = [];

        for (let i = 0; i < segments; i++) {
            this.points.push(new Point(x + i * spacing, y));
            if (i > 0) {
                this.springs.push(new Spring(this.points[i - 1], this.points[i], stiffness, spacing));
            }
        }
    }

    integrate(deltaTime) {
        for (let point of this.points) {
            point.integrate(deltaTime);
        }
    }

    solveConstraints() {
        for (let spring of this.springs) {
            spring.solve();
        }
    }
}