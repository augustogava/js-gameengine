class Circle extends ObjectMain {
  constructor(position, mass, radius, degrees, speed, direction) {
    super(Circle, mass, position, degrees, speed, direction);

    this.radius = radius;
    this.z = 1;
    this.accelerate(new Vector(0, 0.98)); //gravity

    this.physics = new Physics(mass);
    // this.physics.addForce(this.physics.gravity.multiplyBy(this.mass));
  }

  accelerate(accel) {
    this.acceleration.addTo(accel);
  }

  force(v) {
    this.acceleration.multiplyBy(v);
  }

  decrease(v) {
    this.acceleration.subtractFrom(v);
  }

  getSpeed() {
    var lpos = this.position.subtract(this.positionOld);
    return lpos.getLength();
  }

  update(deltaTime) {
    if (!this.statePhysics) {
      return;
    }

    this.velocity.multiplyBy(.99);
    // this.velocity.addTo(new Vector( 1-deltaTime/100000, 0));
    this.velocity.addTo(this.acceleration);
    this.position.addTo(this.velocity);

    this.position.x += game.fps * (deltaTime/1000);
    this.position.y += game.fps * (deltaTime/1000);

    // this.position.addTo( new Vector( this.getSpeed()* deltaTime) *5, Math.sin(deltaTime) *5));
    // this.position.x += ;
    // this.position.y += Math.sin(deltaTime) *5;
    

    // this.position.multiply(.95);

    if (Globals.getBoundaries()) {
      if (this.position.y + this.radius >= canvas.height) {
        this.position.y = canvas.height - this.radius;
        this.velocity.y = this.velocity.y * -1;
        this.velocity.multiplyBy(.97);
      }

      if (this.position.y + this.radius <= 0) {
        this.position.y = this.radius;
        this.velocity.y = this.velocity.y * -1;
        this.velocity.multiplyBy(.97);

      }

      if (this.position.x + this.radius >= canvas.width) {
        this.position.x = canvas.width - this.radius;
        this.velocity.multiplyBy(.97);
      }

      if (this.position.x <= 0) {
        this.position.x = 0 + this.radius;
        this.velocity.x = this.velocity.x * -1;
        this.velocity.multiplyBy(.97);
      }
    }

    this.commonsUpdate(this);
  }

  rotation() { }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }


  collidesWith(other) {
    if (other instanceof Rectangle) {
      return this.resolveCollision(other);
    }

    const deltaX = this.position.x - other.position.x;
    const deltaY = this.position.y - other.position.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const minimumDistance = this.radius + other.radius + 1;

    if (distance <= minimumDistance) {
      this.resolveCollisionV2(other);
    }

    return false;
  }


  rotate(velocity, angle) {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
  }

  /**
   * Swaps out two colliding particles' x and y velocities after running through
   * an elastic collision reaction equation
   *
   * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
   * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
   * @return Null | Does not return a value
   */

  resolveCollisionV2(otherParticle) {
    const xVelocityDiff = this.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = this.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.position.x - this.position.x;
    const yDist = otherParticle.position.y - this.position.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.position.y - this.position.y, otherParticle.position.x - this.position.x);

      // Store mass in var for better readability in collision equation
      const m1 = this.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = this.rotate(this.velocity, angle);
      const u2 = this.rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = this.rotate(v1, -angle);
      const vFinal2 = this.rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      this.velocity.x = vFinal1.x;
      this.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
    }
  }

  resolveCollision(otherBall) {
    const response_coef = 0.5;
    var v = this.position.subtract(otherBall.position);
    var dist2 = v.x * v.x + v.y * v.y;
    var min_dist = this.radius + otherBall.radius;

    if (dist2 < min_dist * min_dist) {
      var dist = Math.sqrt(dist2);
      var n = v.divide(dist);
      var mass_ratio_1 = this.mass / (this.mass + otherBall.mass);
      var mass_ratio_2 = otherBall.mass / (this.mass + otherBall.mass);

      const delta = 1 * response_coef * (dist - min_dist);
      var subValue = n.multiply((mass_ratio_2 * delta));
      var subValueOther = n.multiply((mass_ratio_1 * delta));

      // Update positions
      this.position.subtractFrom(subValue);
      otherBall.position.addTo(subValueOther);
    }
  }

  debug() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "13px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillText(" SpeedLengh: " + this.velocity.getLength() + " Speed: " + this.getSpeed(), this.position.x - 80, this.position.y - 110);
    ctx.fillText(this.id, this.position.x - 5, this.position.y - 5);
    ctx.fillText(
      "x: " +
      this.positionFixed.x +
      " y: " +
      this.positionFixed.y +
      " r: " +
      this.radius,
      this.position.x - 72,
      this.position.y - this.radius - 42
    );

    ctx.fillText(
      "vx: " + this.velocityFixed.x + " vy: " + this.velocityFixed.y,
      this.position.x - this.radius,
      this.position.y - this.radius - 20
    );

    // Draw the projection of the Circle in the future
    const velocity = this.velocity.add(
      this.acceleration.multiply(game.debugger.PROJECTION_STEP)
    );
    const nextX =
      this.position.x + this.velocity.x * game.debugger.PROJECTION_STEP;
    const nextY =
      this.position.y + this.velocity.y * game.debugger.PROJECTION_STEP;

    ctx.strokeStyle = this.colorProjection;
    ctx.beginPath();
    // ctx.globalAlpha = .4 ;
    // ctx.lineWidth = "2";
    ctx.fill();
    ctx.arc(nextX, nextY, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    game.debugger.log({
      id: this.id,
      type: "circle",
      timestamp: Date.now(),

      x: this.position.x,
      y: this.position.y,
      radius: this.radius,
    });

    // this.drawShadow();

    ctx.globalAlpha = 1;
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
        const force = direction.normalize().multiplyBy(forceMag);

        this.physics.applyForce(force);
      }
    }
  }

  applyGravity() {
    // console.log(this.physics.forces)
    this.position.addTo(new Vector(0, 1))
  }

  applyFriction() {
    this.physics.applyForce({
      x: this.velocity.x * -1 * this.friction,
      y: this.velocity.y * -1 * this.friction,
    });
  }

  angleTo(p2) {
    return Math.atan2(p2.position.getY() - this.position.getY(), p2.position.getX() - this.position.getX());
  }

  distanceTo(p2) {
    var dx = p2.position.getX() - this.position.getX(),
      dy = p2.position.getY() - this.position.getY();

    return Math.sqrt(dx * dx + dy * dy);
  }

  gravitateTo(p2) {
    var grav = vector.create(0, 0),
      dist = this.distanceTo(p2);

    grav.setLength(p2.mass / (dist * dist));
    grav.setAngle(this.angleTo(p2));
    this.velocity.addTo(grav);
  }
}
