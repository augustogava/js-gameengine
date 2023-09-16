class Rectangle extends ObjectMain {
  constructor(position, mass, width, height, degrees, speed, direction) {
    super(Rectangle, mass, position, velocity, degrees, speed, direction);

    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;

    this.debugData = {
      normal: -1,
      distance: -1,
      massDiff: -1,
      relativeVelocity: -1,
      pa: [],
      pb: [],
    };
  }

  update(deltaTime) {
    if (!this.statePhysics) {
      return;
    }
    const deltaTimeSeconds = deltaTime / 1000;

    this.applyGravity();

    if (Globals.getBoundaries()) {
      if (this.position.y + this.height >= canvas.height) {
        this.position.y = canvas.height - this.height;

        this.velocity.y = this.velocity.y * -1 * this.physics.friction;
        if (Math.abs(this.velocity.x) > 10 || Math.abs(this.velocity.y) > 1) {
          this.velocity.x *= this.physics.friction;
        }
      }

      if (this.position.y + this.height < 0) {
        this.position.y = this.height;

        this.velocity.y = this.velocity.y * -1 * this.physics.friction;
      }

      if (this.position.x + this.width >= canvas.width) {
        this.position.x = canvas.width - this.width;
        this.velocity.x = this.velocity.x * -1 * this.physics.friction;
      }

      if (this.position.x < 0) {
        this.position.x = 0 + this.width;
        this.velocity.x = this.velocity.x * -1 * this.physics.friction;
      }
    }

    this.commonsUpdate(this);
  }

  draw() {
    ctx.save();

    ctx.fillStyle = this.color;
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    ctx.beginPath();
    ctx.rotate(this.angle);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.closePath();
    ctx.restore();

    this.drawArrow();
  }

  drawArrow() {
    // const arrowLength = 2 * this.velocity.magnitude();
    // const arrowBase = new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    // const arrowTip = arrowBase.add(this.velocity.normalize().scale(arrowLength));

    // ctx.save();
    // ctx.lineWidth = 3;
    // ctx.strokeStyle = "red";
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.moveTo(arrowBase.x, arrowBase.y);
    // ctx.lineTo(arrowTip.x, arrowTip.y);
    // ctx.stroke();
    // ctx.translate(arrowTip.x, arrowTip.y);
    // ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(-10, -5);
    // ctx.lineTo(-10, 5);
    // ctx.closePath();
    // ctx.fill();
    // ctx.restore();
  }

  debug() {
    ctx.save();

    ctx.fillStyle = "white";
    ctx.font = "13px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillText(
      this.id,
      this.position.x + this.width / 2 - 12,
      this.position.y + this.height / 2 - 5
    );

    ctx.fillText(
      "x: " +
      this.positionFixed.x +
      " y: " +
      this.positionFixed.y +
      " W: " +
      this.width,
      this.position.x,
      this.position.y - 40
    );

    ctx.fillText(
      "vx: " + this.velocityFixed.x + " y: " + this.velocityFixed.y,
      this.position.x,
      this.position.y - 20
    );

    ctx.restore();

    ctx.save();
    ctx.beginPath();


    game.debugger.log({
      id: this.id,
      type: "rectangle",
      timestamp: Date.now(),
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    });
  }

  drawShadow() {
    ctx.strokeStyle = this.colorProjection;

    this.historyShadow.forEach((shadow, index) => {
      ctx.save();

      ctx.beginPath();
      ctx.globalAlpha = 0.1 - index * this.SHADOW_HISTORY;
      ctx.rotate(shadow.angle);
      ctx.translate(shadow.x + shadow.width / 2, shadow.y + shadow.height / 2);
      ctx.strokeRect(
        -shadow.width / 2,
        -shadow.height / 2,
        shadow.width,
        shadow.height
      );
      ctx.closePath();

      ctx.restore();
    });

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

    const objs = game.getObjects();

    for (let i = 0; i < objs.length; i++) {
      if (this.id != objs[i].id) {
        otherObj = objs[i];

        const direction = this.position.sub(otherObj.position);
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

  // collidesWith(other) {
  //   if (other instanceof Rectangle) {
  //     if (SAT.isColliding(this, other)) {
  //       this.resolveCollisionNewSAT(other);
  //     }
  //   } else if (other instanceof Circle) {
  //   }

  //   const closestX = Utils.clamp(
  //     this.position.x,
  //     other.position.x - other.sideLength / 2,
  //     other.position.x + other.sideLength / 2
  //   );
  //   const closestY = Utils.clamp(
  //     this.position.y,
  //     other.position.y - other.sideLength / 2,
  //     other.position.y + other.sideLength / 2
  //   );
  //   const distance = Math.sqrt(
  //     (closestX - this.position.x) * (closestX - this.position.x) +
  //     (closestY - this.position.y) * (closestY - this.position.y)
  //   );

  //   const minimumDistance = this.width / 2;

  //   if (distance <= minimumDistance) {
  //   }
  // }

  project(shape, axis) {
    let min = shape[0].dot(axis);
    let max = min;
    for (let i = 1; i < shape.length; i++) {
      let value = shape[i].dot(axis);
      if (value < min) {
        min = value;
      } else if (value > max) {
        max = value;
      }
    }
    return { min: min, max: max };
  }

  collidesWith(rect2) {
    
  }

  resolve(rect2, collisionNormal, collisionPoint) {

  }

  projectOnto(vector) {
    const unit = this.velocity.unit();
    return unit.mult(unit.dot(vector));
  }

  // method to get the projection of a vector onto the surface of an object
  project(vector) {
    const surfaceNormal = new Vector(0, 1); // assuming the surface is a horizontal plane
    return this.projectOnto(surfaceNormal.mult(surfaceNormal.dot(vector)));
  }

}
