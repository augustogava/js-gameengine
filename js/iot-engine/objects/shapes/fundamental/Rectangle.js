class Rectangle extends BasicForms  {
	constructor(x1, y1, x2, y2, width, angle) {
		super();
		// super(Box, rocketFake, null, new Vector(x1, y1), 100);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";

		this.width = width;

		var p1 = new Vertex(new Vector(x1, y1));	// 		200,250

		var p2 = new Vertex(new Vector(x2, y2));	//400, 450
        this.dir = p2.position.subtract(p1.position).unit();

        this.refDir = p2.position.subtract(p1.position).unit();
        this.length = p2.position.subtract(p1.position).mag();
		
		var p3 = new Vertex( p2.position.add( this.dir.normal().mult(this.width) ) );	//329 520
		var p4 = new Vertex( p3.position.add( this.dir.normal().mult(this.width) ) ); // 258 591
		this.vertices.push(p1);
		this.vertices.push(p2);
		this.vertices.push(p3);
		this.vertices.push(p4);

		this.edges.push(new Edge(p1, p2, p1.position.distance(p2.position), 2));
		this.edges.push(new Edge(p2, p3, p2.position.distance(p3.position), 3));
		this.edges.push(new Edge(p3, p4, p3.position.distance(p4.position), 3));
		this.edges.push(new Edge(p4, p1, p4.position.distance(p1.position), 3));
		this.edges.push(new Edge(p1, p3, p1.position.distance(p3.position), 3, true));

		this.faces.push(new Face([p1, p2, p3, p4]));

		this.position = p1.position.add(this.dir.mult(this.length/2)).add(this.dir.normal().mult(this.width/2));	// 260 380

		this.angle = Utils.degreesToRads(angle);
		this.angVel = 0;
		this.rotMat = new Matrix(2, 2);
	}

	getPosition(){
		return this.vertices[0].position.add(this.dir.mult(this.length/2)).add(this.dir.normal().mult(this.width/2));	// 260 380
	}

	update(){
		// this.acc = this.acc.unit().mult(this.acceleration);
		this.acc = this.acceleration.unit().mult(1);
		this.velocity.addTo(this.acceleration);
        this.velocity.multiplyBy(this.friction);

        this.position.addTo(this.velocity);

        this.angVel *= 1;
        this.angle += this.angVel;
		
        this.getVertices();
	}

    draw(){
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].position.x, this.vertices[0].position.y);
        ctx.lineTo(this.vertices[1].position.x, this.vertices[1].position.y);
        ctx.lineTo(this.vertices[2].position.x, this.vertices[2].position.y);
        ctx.lineTo(this.vertices[3].position.x, this.vertices[3].position.y);
        ctx.lineTo(this.vertices[0].position.x, this.vertices[0].position.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    getVertices(){
        this.rotMat = Matrix.rotMx(this.angle);
        this.dir = this.rotMat.multiplyVec(this.refDir);

        this.vertices[0].position = this.position.add(this.dir.mult(-this.length/2)).add(this.dir.normal().mult(this.width/2));
        this.vertices[1].position = this.position.add(this.dir.mult(-this.length/2)).add(this.dir.normal().mult(-this.width/2));
        this.vertices[2].position = this.position.add(this.dir.mult(this.length/2)).add(this.dir.normal().mult(-this.width/2));
        this.vertices[3].position = this.position.add(this.dir.mult(this.length/2)).add(this.dir.normal().mult(this.width/2));
    }
}