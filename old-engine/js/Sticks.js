class Sticks extends ObjectMain {
  constructor(position, velocity, mass, width, height, degrees) {
    super(Rectangle, mass, position, velocity, degrees);

    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
    this.points = [];
    this.sticks = [];
    this.forms = [];
    this.bounce = 0.9

    this.points.push({
      x: 100,
      y: 100,
      oldx: 100 + Math.random() * 50 - 25,
      oldy: 100 + Math.random() * 50 - 25
    });
    this.points.push({
      x: 200,
      y: 100,
      oldx: 200,
      oldy: 100
    });
    this.points.push({
      x: 200,
      y: 200,
      oldx: 200,
      oldy: 200
    });
    this.points.push({
      x: 100,
      y: 200,
      oldx: 100,
      oldy: 200
    });

    this.sticks.push({
      p0: this.points[0],
      p1: this.points[1],
      length: Utils.distance(this.points[0], this.points[1]),
      color: "red",
      width: 5
    });
    
    this.sticks.push({
      p0: this.points[1],
      p1: this.points[2],
      length: Utils.distance(this.points[1], this.points[2])
    });

    this.sticks.push({
      p0: this.points[2],
      p1: this.points[3],
      length: Utils.distance(this.points[2], this.points[3])
    });

    this.sticks.push({
      p0: this.points[3],
      p1: this.points[0],
      length: Utils.distance(this.points[3], this.points[0])
    });

    this.sticks.push({
      p0: this.points[0],
      p1: this.points[2],
      length: Utils.distance(this.points[0], this.points[2]),
      hidden: true
    });

    this.forms.push({
      path: [
        this.points[0],
        this.points[1],
        this.points[2],
        this.points[3]
      ],
      color: "green"
    });

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

    // this.applyGravity();
    this.updatePoints();
    for (var i = 0; i < 5; i++) {
      this.updateSticks();
      this.constrainPoints();
    }

    this.commonsUpdate(this);
  }

  draw() {
    ctx.save();

    for (var i = 0; i < this.forms.length; i++) {
      var f = this.forms[i];
      ctx.beginPath();
      ctx.fillStyle = f.color;
      ctx.moveTo(f.path[0].x, f.path[0].y);

      for (var j = 1; j < f.path.length; j++) {
        ctx.lineTo(f.path[j].x, f.path[j].y);
      }

      ctx.fill();
    }

    ctx.restore();
    // this.drawArrow();
  }

  updatePoints() {
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i],
        vx = (p.x - p.oldx) * this.physics.friction,
        vy = (p.y - p.oldy) * this.physics.friction;

      p.oldx = p.x;
      p.oldy = p.y;
      p.x += vx;
      p.y += vy;
      p.y += 0.5;
    }
  }

  constrainPoints() {
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i],
        vx = (p.x - p.oldx) * this.physics.friction,
        vy = (p.y - p.oldy) * this.physics.friction;

      if (p.x > canvas.width) {
        p.x = canvas.width;
        p.oldx = p.x + vx * this.bounce;
      }
      else if (p.x < 0) {
        p.x = 0;
        p.oldx = p.x + vx * this.bounce;
      }
      if (p.y > canvas.height) {
        p.y = canvas.height;
        p.oldy = p.y + vy * this.bounce;
      }
      else if (p.y < 0) {
        p.y = 0;
        p.oldy = p.y + vy * this.bounce;
      }
    }
  }

  updateSticks() {
    for (var i = 0; i < this.sticks.length; i++) {
      var s = this.sticks[i],
        dx = s.p1.x - s.p0.x,
        dy = s.p1.y - s.p0.y,
        distance = Math.sqrt(dx * dx + dy * dy),
        difference = s.length - distance,
        percent = difference / distance / 2,
        offsetX = dx * percent,
        offsetY = dy * percent;

      s.p0.x -= offsetX;
      s.p0.y -= offsetY;
      s.p1.x += offsetX;
      s.p1.y += offsetY;
    }
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
