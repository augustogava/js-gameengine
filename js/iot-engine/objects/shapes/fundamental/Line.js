class Line extends BasicForms {
    constructor(x0, y0, x1, y1) {
        super();

        this.vertices = [
            new Vertex(new Vector(x0, y0)),
            new Vertex(new Vector(x1, y1))
        ];

        this.dir = this.vertices[1].position.subtract(this.vertices[0].position).unit();
        this.mag = this.vertices[1].position.subtract(this.vertices[0].position).mag();

        this.position = new Vector(
            (this.vertices[0].position.x + this.vertices[1].position.x) / 2,
            (this.vertices[0].position.y + this.vertices[1].position.y) / 2
        );

        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].position.x, this.vertices[0].position.y);
        ctx.lineTo(this.vertices[1].position.x, this.vertices[1].position.y);

        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }
}