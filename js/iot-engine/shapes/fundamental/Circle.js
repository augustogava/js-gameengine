class Circle extends BasicForms{
    constructor(position, radius) {
        super()
        this.vertex = [];
        this.position = position
        this.radius = radius;
        
        ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";

        this.velocity = undefined;
		this.acceleration =  undefined;
        this.acc =  undefined;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
}