class Boundary {
    constructor(pos, width, height) {
        this.position = pos;
        this.width = width;
        this.height = height;
        this.color = "red";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.getX(), this.position.getY(), this.width, this.height);
    }

    update() {
    }

    containsPoint(point) {
        const x = point.getX();
        const y = point.getY();
        return (
            x >= this.position.getX() &&
            x <= this.position.getX() + this.width &&
            y >= this.position.getY() &&
            y <= this.position.getY() + this.height
        );
    }

    resolveCollision(otherBody) {
        if (otherBody instanceof BodyDef) {
            const overlapX = Math.min(
                otherBody.position.getX() - this.position.getX() + this.width,
                this.position.getX() + this.width - otherBody.position.getX()
            );
            const overlapY = Math.min(
                otherBody.position.getY() - this.position.getY() + this.height,
                this.position.getY() + this.height - otherBody.position.getY()
            );

            if (overlapX < overlapY) {
                otherBody.position.setX(otherBody.position.getX() + (overlapX * -Math.sign(otherBody.velocity.getX())));
                otherBody.velocity.setX(0);
            } else {
                otherBody.position.setY(otherBody.position.getY() + (overlapY * -Math.sign(otherBody.velocity.getY())));
                otherBody.velocity.setY(0);
            }
        }
    }
}
