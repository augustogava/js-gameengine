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
}
