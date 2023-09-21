class Wall extends BodyDef {
    constructor(rocketFake, x1, y1, x2, y2){
        super(Wall);
        this.rocketFake = rocketFake;
        ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";

        this.setBodyType('static')
        this.shape = new Line(x1, y1, x2, y2);
		this.position = this.shape.position;
    }

    draw(){
        this.shape.draw();
    }
}