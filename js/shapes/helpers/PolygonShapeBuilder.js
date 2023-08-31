class PolygonShapeBuilder {
	static createBox(position){
		let vertices = [];
		let edges = [];
		let faces = [];
		
		var p1 = new Vertex(position.add(new Vector(100, 100)));
		var p2 = new Vertex(position.add(new Vector(200, 100)));
		var p3 = new Vertex(position.add(new Vector(200, 200)));
		var p4 = new Vertex(position.add(new Vector(100, 200)));

		vertices.push(p1);
		vertices.push(p2);
		vertices.push(p3);
		vertices.push(p4);

		// var p6 = new Vertex(new Vector(400, 100));
		// var p7 = new Vertex(new Vector(250, 100));
		// // vertices.push(p5);
		// vertices.push(p6);
		// vertices.push(p7);

		edges.push(new Edge(p1, p2, p1.position.distance(p2.position), 2));
		edges.push(new Edge(p2, p3, p2.position.distance(p3.position), 3));
		edges.push(new Edge(p3, p4, p3.position.distance(p4.position), 3));
		edges.push(new Edge(p4, p1, p4.position.distance(p1.position), 3));
		edges.push(new Edge(p1, p3, p1.position.distance(p3.position), 3, true));

		// engine = new Engine(new Vector(300, 139), new Vector(300, 139));
		// edges.push(new Edge(engine, p1, engine.position.distance(p1.position), 3));
		// edges.push(new Edge(p6, p7, p6.position.distance(p7.position), 3));

		faces.push(new Face([p1, p2, p3, p4]));

		return {
			vertices: vertices,
			edges: edges,
			faces: faces
		}
	}
}