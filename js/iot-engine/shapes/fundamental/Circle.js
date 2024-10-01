class Circle extends BasicForms {
    constructor(position, radius) {
        super();
        this.position = position instanceof Vector ? position : new Vector(position.x, position.y); // Ensure position is a Vector
        this.radius = radius;
        
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";

        this.velocity = undefined;
        this.acceleration = undefined;
        this.acc = undefined;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.getX(), this.position.getY(), this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    debug() {
        ctx.fillStyle = "black";
        ctx.font = "14px Arial bold";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        ctx.fillText("Direct X: " + this.position.getX() + " y: " + this.position.getY(), this.position.getX() - 70, this.position.getY() - this.radius - 30);

        // ctx.fillText("Accele:" + this.acceleration.getLength() + " | Thottle:" + this.rocketFake.throttle + " Force:" + this.forceCalculated, this.position.getX() - 50, this.position.getY() - this.radius - 30);
        ctx.closePath();
    }

}
