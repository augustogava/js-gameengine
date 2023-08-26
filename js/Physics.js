class Physics {
  constructor(mass) {
    this.gravity = new Vector(0, 9.8);
    this.airResistence = .98;
    this.friction = game.physicsFriction;
    this.restitution = .005;
    this.forces = [];
    this.mass = mass;
  }

  addForce(force) {
    this.forces.push(force);
  }

  // Newton's 1st law
  get netForce() {
    return this.forces.reduce((netForce, force) => {
      netForce.x += force.x;
      netForce.y += force.y;

      return netForce;
    }, { x: 0, y: 0 });

  }

  // Newton's 2nd law
  get acceleration() {
    const netForce = this.netForce;
    return new Vector(
      netForce.x / this.mass,
      netForce.y / this.mass
    );
  }

  // Newton's 3rd law
  applyForce(force) {
    this.forces.push({
      x: -force.x,
      y: -force.y
    });
  }

  resetForces() {
    this.physics.forces = []
  }
}