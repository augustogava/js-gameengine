class Spring extends ObjectMain {
  constructor(position, velocity, mass, degrees) {
    super(Circle, mass, position, velocity, degrees);

    this.radius = radius;
    this.z = 1;
  }

  update(deltaTime) {
    if (!this.statePhysics) {
      return;
    }

    const deltaTimeSeconds = deltaTime / 1000;

    this.applyGravity();


    if (Globals.getBoundaries()) {
      if (this.position.y + this.radius >= canvas.height) {
        this.position.y = canvas.height - this.radius;

        this.velocity.y = this.velocity.y * -1 * this.physics.friction;
        if (Math.abs(this.velocity.x) > 10 || Math.abs(this.velocity.y) > 1) {
          this.velocity.x *= this.physics.friction;
        }
      }

      if (this.position.y + this.radius <= 0) {
        this.position.y = this.radius;

        this.velocity.y = this.velocity.y * -1 * this.physics.friction;
      }

      if (this.position.x + this.radius >= canvas.width) {
        this.position.x = canvas.width - this.radius;
        this.velocity.x = this.velocity.x * -1 * this.physics.friction;
      }

      if (this.position.x <= 0) {
        this.position.x = 0 + this.radius;
        this.velocity.x = this.velocity.x * -1 * this.physics.friction;
      }
    }

    this.commonsUpdate(this);
  }

  rotation() { }

  draw() {
    ctx.save();


    // radgrad.addColorStop(0, this.color);
    // radgrad.addColorStop(0.7, Utils.changeRedSoftness(this.color, 220));
    // radgrad.addColorStop(1, Utils.changeRedSoftness(this.color, 200));

    // ctx.fillStyle = radgrad;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    this.drawArrow();


  }

  debug() {
    
  }

  attract() {
    let otherObj = undefined;
    //findotherbj
    if (
      !Globals.isAttraction() ||
      !game.getObjects() ||
      (game.getObjects() != undefined && game.getObjects().length == 1)
    ) {
      return;
    }

    const balls = game.getObjects();

    for (let i = 0; i < balls.length; i++) {
      if (this.id != balls[i].id) {
        otherObj = balls[i];

        const direction = this.position.position(otherObj.position);
        const distance = direction.magnitude();

        const forceMag =
          this.G * ((this.mass * otherObj.mass) / Math.pow(distance, 2));
        const force = direction.normalize().scale(forceMag);

        this.physics.applyForce(force);
      }
    }
  }

  applyGravity() {
    // console.log(this.physics.forces)
  }

  applyFriction() {
    this.physics.applyForce({
      x: this.velocity.x * -1 * this.friction,
      y: this.velocity.y * -1 * this.friction,
    });
  }
}
