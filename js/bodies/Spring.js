class Spring {
    constructor(pointA, pointB, stiffness, length) {
        this.pointA = pointA;
        this.pointB = pointB;
        this.stiffness = stiffness;
        this.length = length || pointA.position.subtract(pointB.position).length();
    }

    solve() {
        let delta = this.pointB.position.subtract(this.pointA.position);
        let deltaLength = delta.length();
        let difference = (deltaLength - this.length) / deltaLength;

        delta.multiply(this.stiffness * difference * 0.5);
        this.pointA.position.add(delta);
        this.pointB.position.subtract(delta);
    }
}
