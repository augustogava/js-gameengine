class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        const length = this.getLength();
        if (length == 0)
            return this;

        return new Vector(this.x / length, this.y / length);
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
        return Math.sqrt(this.x * this.x + this.y * this.y);
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
}