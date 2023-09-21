
class BasicForms {
    constructor() {
        this.vertices = [];
		this.edges = [];
		this.faces = [];

		this.angle = 0;
		this.angVel = 0;
		this.bounce = 0;
		this.torque = 0;
		this.momentOfInertia = 1;
		this.angularDamping = 1;
		this.friction = .9;

		this.position = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
        this.acc = new Vector(0, 0);
    }
}