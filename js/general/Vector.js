class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero() {
        return new Vector(0, 0);
    }

    static $(x = 0, y = 0) {
        return new Vector(x, y);
    }

    isEmpty() {
        return (this.getX() == 0 && this.getY() == 0);
    }

    isNull() {
        return (this.getX() == null || this.getY() == null);
    }

    normalize() {
        const length = this.getLength();
        if (length == 0)
            return this;

        return new Vector(this.x / length, this.y / length);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    rotate(angle) {
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        return new Vector(this.x * cosA - this.y * sinA, this.x * sinA + this.y * cosA);
    }

    setX(value) {
        this.x = value;
    }

    getX() {
        return this.x;
    }

    setY(value) {
        this.y = value;
    }

    getY() {
        return this.y;
    }

    setAngle(angle) {
        var length = this.getLength();
        this.x = Math.cos(angle) * 1;
        this.y = Math.sin(angle) * 1;
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }


    heading() {
        var angle = this.getAngle();
        return new Vector(Math.cos(angle), Math.sin(angle));
    }


    getHeading(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    setHeading(angle) {
        var angle = this.getAngle();
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
    }

    setLength(length) {
        var angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getLength() {
        return Math.sqrt(this.dot(this));
    }

    length() {
        return this.getLength();
    }

    add(v2) {
        return new Vector(this.x + v2.getX(), this.y + v2.getY());
    }

    subtract(v2) {
        return new Vector(this.x - v2.getX(), this.y - v2.getY());
    }

    multiply(val) {
        return new Vector(this.x * val, this.y * val);
    }

    divide(val) {
        return new Vector(this.x / val, this.y / val);
    }

    addTo(v2) {
        this.x += v2.getX();
        this.y += v2.getY();

        return this;
    }

    subtractFrom(v2) {
        this.x -= v2.getX();
        this.y -= v2.getY();

        return this;
    }

    multiplyBy(val) {
        this.x *= val;
        this.y *= val;

        return this;
    }

    divideBy(val) {
        this.x /= val;
        this.y /= val;

        return this;
    }

    addVal(v) {
        return new Vector(this.x + v, this.y + v);
    }

    addValBy(v) {
        this.x += v;
        this.y += v;
        return this;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    distance(p1) {
        var dx = this.x - p1.x,
            dy = this.y - p1.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }
}