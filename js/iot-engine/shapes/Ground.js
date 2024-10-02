class Ground extends BodyDef {
    constructor(rocketFake, mass, start, end) {
        super(Ground, mass, start);
        this.rocketFake = rocketFake;
        this.physics = new Physics(this);

        this.start = start;
        this.end = end;

        this.color = "black";
        this.setBodyType('static');

        this.shape = new Line(start.x, start.y, end.x, end.y);
        this.angle = end.subtract( start ).headingRadian();

        this.bounce = 0;
        this.friction = 0.9;
        this.elasticity = 0;

        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.inv_m = (this.mass === 0) ? 0 : (1 / this.mass);
    }

    update(deltaTime) {
    }

    draw() {
        if (this.shape && this.shape.vertices.length > 0) {
            this.shape.draw();
        } else {
            console.error("Shape or shape position is invalid.");
        }
    }

    display() {
    }

    below(pos, r) {
        if (pos.x < this.start.x || pos.x > this.end.x) {
            return false;
        }
        let amt = (pos.x - this.start.x) / (this.end.x - this.start.x);
        return (pos.y + r) - MathHelper.lerp(this.start.y, this.end.y, amt);
    }

    intersects(otherShape) {
        return false;

        if (otherShape.shape instanceof Circle) {
            return this.collidesWithCircle(otherShape);
        } else if (otherShape.shape instanceof Ground) {
            return this.collidesWithGround(otherShape);
        }

    }

    collidesWithCircle(otherShape) {
        // let below = otherShape.below(this.shape.position, otherShape.radius);
        // if (below > 0) {
        //     this.velocity.y *= -1;
        //     this.velocity.rotate(otherShape.angle);
        //     this.shape.position.y -= below;
        // }
    }

    collidesWithGround(otherShape) {

    }

}
