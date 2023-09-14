class Ball extends BodyDef {
    constructor(rocketFake, position, mass) {
        super(Ball, mass, position, null, null, null);
        this.physics = new Physics(this);
        
        this.setBodyType('dynamic');
        this.createShape('circle');
        this.rocketFake = rocketFake;
        this.radius = 40;
        this.rotation = 0

        this.forceCalculated = 0;
        this.maxForceDistanceEvaluator = 40;
        this.directionLenth = 130;
        this.color = "black";
        this.force = new Vector(0, 0);
        this.directionBoost = new Vector(0, 0);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.elastisticy = .85;

        this.init();
    }

    reset() {
        this.init();
    }

    init() {
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    intersects(otherShape) {
        if (otherShape.shape instanceof PolygonShape) {
            let d = CollisionFlat.intersectCirclePolygon(this.position, this.radius, otherShape.getCenter(), otherShape.vertices);
            if (d.normal != null) {
                CollisionFlat.resolveCollision(this, otherShape, d.normal, d.depth);
            }
        } else if (otherShape.shape instanceof Circle) {
            let d = CollisionFlat.intersectCircles(this.position, this.radius, otherShape.position, otherShape.radius);
            if (d.normal != null) {
                // CollisionFlat.resolveCollision(this, otherShape, d.normal, d.depth);
                this.resolveCollision( otherShape);
            }
        }
    }

    resolveCollision(otherShape) {
        if (otherShape.shape instanceof Circle) {
            this.shape.resolveCollision(otherShape);
        } else if (otherShape.shape instanceof PolygonShape) {
            console.log("col shape")
            return this.resolveCollisionWithPolygon(otherShape);
        }
    }

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
    

    resolveCollisionWithPolygon(polygon) {
        let smallestOverlap = Infinity;
        let smallestAxis = null;

        if (polygon.containsPoint(this.position)) {
            for (let edge of polygon.edges) {
                let axis = new Vector(edge.p1.position.getY() - edge.p0.position.getY(), edge.p0.position.getX() - edge.p1.position.getX()).normalize();
                let overlap = this.radius - this.distanceToLineSegment(edge.p0.position, edge.p1.position);
                if (overlap < smallestOverlap) {
                    smallestOverlap = overlap;
                    smallestAxis = axis;
                }
            }
        }

        for (let vertex of polygon.vertices) {
            if (this.containsPoint(vertex.position)) {
                let axis = vertex.position.subtract(this.position).normalize();
                let overlap = this.radius - vertex.position.distance(this.position);
                if (overlap < smallestOverlap) {
                    smallestOverlap = overlap;
                    smallestAxis = axis;
                }
            }
        }

        if (smallestAxis) {
            let centerPolygon = polygon.getCenter();
            let directionToPolygon = this.position.subtract(centerPolygon).normalize();

            if (smallestAxis.dot(directionToPolygon) < 0) {
                smallestAxis = smallestAxis.multiply(-1);
            }

            let impulse = smallestAxis.multiply(smallestOverlap * 2);
            let circleMass = this.mass || 1;
            let polygonMass = polygon.mass || 1;
            let totalMass = circleMass + polygonMass;

            this.velocity.addTo(impulse.multiply(polygonMass / totalMass));
            polygon.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
        }
    }

    collidesWithPolygon(polygon) {
        if (polygon.containsPoint(this.position)) {
            return true;
        }

        for (let vertex of polygon.vertices) {
            if (this.containsPoint(vertex.position)) {
                return true;
            }
        }

        for (let edge of polygon.edges) {
            if (this.distanceToLineSegment(edge.p0.position, edge.p1.position) < this.radius) {
                return true;
            }
        }

        return false;
    }

    containsPoint(point) {
        return this.position.distance(point) <= this.radius;
    }

    distanceToLineSegment(p0, p1) {
        let dx = p1.getX() - p0.getX();
        let dy = p1.getY() - p0.getY();
        let t = ((this.position.getX() - p0.getX()) * dx + (this.position.getY() - p0.getY()) * dy) / (dx * dx + dy * dy);
        t = Math.max(0, Math.min(1, t));
        let nearest = new Vector(p0.getX() + t * dx, p0.getY() + t * dy);

        return this.position.distance(nearest);
    }

    accel(v) {
        if (this.getSpeed() > 3 || (canvas.height - this.position.getY() - this.radius > 25)) {
            this.throttle = false;
            this.rocketFake.throttle = false;
            return;
        }

        this.throttle = true;
        this.acceleration.addTo(new Vector(v, 0));
    }

    getSpeed() {
        return this.acceleration.getLength();
    }

    applyBoost() {
        // if (canvas.height - this.position.getY() - this.radius > 15) {
        //     return;
        // }
        let f = this.forceMouseDown.multiplyBy(1).getLength();
        if (f > this.maxForceDistanceEvaluator)
            f = this.maxForceDistanceEvaluator;

        this.forceCalculated = Math.abs(f);
        if (this.forceCalculated <= 9 || !this.direction) {
            this.forceCalculated = 0;
            return;
        }

        if (this.forceCalculated > this.maxForceDistanceEvaluator) {
            this.forceCalculated = this.maxForceDistanceEvaluator;
        }

        let mn = this.direction.normalize();
        mn.multiplyBy(this.forceCalculated);

        this.velocity.addTo(mn.multiplyBy(1));
        this.forceCalculated = 0;
        this.rocketFake.selectedBody = false;
    }

    initImpulsePoint() {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }

        // this.mouseClickDownPosition = eventshelper.mousepos
        this.directionBoost = eventshelper.mousepos.subtract(this.position);
    }

    update(deltaTime) {
        // this.updateBodyDef();
        if (this.acceleration.getX() != 0 || this.acceleration.getY() != 0) {
            // let movementForceDirection = this.movement.normalize();
            // let force = movementForceDirection.multiply(.7);
            // this.velocity.addTo(force);
        }

        // this.acceleration.addTo(this.movement );
        // this.accelerationHelper = this.accelerationHelper.addTo(this.acceleration)

        this.velocity.addTo(this.acceleration);
        this.velocity.multiplyBy(this.friction);

        this.position.addTo(this.velocity);

        
        this.rotation += this.rotationalVelocity;
        this.direction = eventshelper.mousepos.subtract(this.position);
        this.force = eventshelper.mousepos.subtract(this.position);
        this.forceMouseDown = eventshelper.mousepos.subtract(eventshelper.lastmousepos_down);

        this.lastPosition = this.position;
        this.acceleration = new Vector(0, 0);
    }

    draw() {
        // ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        if (this.imgLoad) {
            ctx.drawImage(this.img, 0, 0);
        }

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.closePath();

        this.drawDirection();
        this.drawForce();

        if (Globals.isDebug()) {
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            // ctx.fillText("Direct X: " + this.direction.normalize().getAngle() + " Y: " + this.direction.normalize().getLength(), this.position.getX() - 70, this.position.getY() - this.radius - 55);

            ctx.fillText("Accele:" + this.acceleration.getLength() + " | Thottle:" + this.rocketFake.throttle + " Force:" + this.forceCalculated, this.position.getX() - 50, this.position.getY() - this.radius - 30);
            ctx.restore();

            if (this.camerabox) {
                ctx.fillStyle = 'rgba(0,0,255,0.2)';
                ctx.fillRect(this.camerabox.position.getX() - this.camerabox.width / 2,
                    this.camerabox.position.getY() - this.camerabox.height / 2,
                    this.camerabox.width,
                    this.camerabox.height);
            }
        }
    }

    drawDirection() {
        let mn = this.direction.normalize();
        mn.multiplyBy(this.directionLenth);

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.moveTo(this.position.getX(), this.position.getY());
        ctx.lineTo(this.position.getX() + mn.getX(), this.position.getY() + mn.getY());
        ctx.strokeStyle = '#1AA7EC';
        ctx.stroke();
    }

    drawForce() {
        if (eventshelper.mousePressingDown()) {
            let mn = this.forceMouseDown.normalize();
            let f = this.forceMouseDown.addValBy(10).multiplyBy(0.2).getLength();
            if (f > this.maxForceDistanceEvaluator)
                f = this.maxForceDistanceEvaluator;

            ctx.beginPath();
            ctx.moveTo(this.position.getX(), this.position.getY());
            // ctx.lineTo(this.position.getX() + mn.getX() * f, this.position.getY() - 5   );
            ctx.lineTo(this.position.getX() + mn.getX() * f, this.position.getY() + mn.getY() * f);
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = "3";
            ctx.stroke();
        }
    }

    userAction() {
        if (eventshelper.keycode) {

            if (eventshelper.keycode === 'ArrowLeft') {
                this.acceleration.addTo(new Vector(-1, 0));
            }

            if (eventshelper.keycode === 'ArrowRight') {
                this.acceleration.addTo(new Vector(1, 0));
            }

            if (eventshelper.keycode === 'ArrowUp') {
                this.acceleration.addTo(new Vector(0, -1));
            }

            if (eventshelper.keycode === 'ArrowDown') {
                this.acceleration.addTo(new Vector(0, 1));
            }

            // if()

            if (eventshelper.keycode === 'KeyD') {
                this.throttle = true;
                this.break = false;
                this.accel(this.rocketFake.speed);
            }

            if (eventshelper.keycode === 'KeyA') {
                this.throttle = true;
                this.break = false;
                this.accel(-this.rocketFake.speed);
            }

            if (eventshelper.keycode === 'KeyS') {
                this.throttle = false;
                this.break = true;
            }
        }

        if (eventshelper.mouseClickDown()) {
            this.initImpulsePoint();
        }

        if (eventshelper.mouseRelease()) {
            this.applyBoost();
        }
    }

    getInputFieldsConfig(){
        return {
            'Circle': [
                // { id: 'speed', label: 'Speed', type: 'number', value: this.getSpeed() },
                // { id: 'color', label: 'Color', type: 'color', value: this.color },
                { id: 'radius', label: 'Radius', type: 'number', value: this.radius },
                { id: 'mass', label: 'Mass', type: 'number', value: this.mass },
                { id: 'elastisticy', label: 'elastisticy', type: 'number', value: this.elastisticy },
                { id: 'positionX', label: 'Position X', type: 'number', value: this.position.getX() },
                { id: 'positionY', label: 'Position Y', type: 'number', value: this.position.getY() }
            ]
        };
    }

    updateFieldUserInstance(property, value){
        this.updateFieldDynamic(property, value)
    }

    updateFieldDynamic(changedField, newValue) {
        if (this.hasOwnProperty(changedField)) {
            // Use bracket notation to set the value dynamically
            this[changedField] = newValue;

        } else {
            if(changedField == "positionX"){
                this.position.x = newValue;
            }

            if(changedField == "positionY"){
                this.position.y = newValue;
            }

        }

        this.updateConstraints();

    }











    // function pen_res_bb(b1, b2){
    //     let dist = b1.pos.subtr(b2.pos);
    //     let pen_depth = b1.r + b2.r - dist.mag();
    //     let pen_res = dist.unit().mult(pen_depth/2);
    //     b1.pos = b1.pos.add(pen_res);
    //     b2.pos = b2.pos.add(pen_res.mult(-1));
    // }
    
    // //collision resolution
    // //calculates the balls new velocity vectors after the collision
    // function coll_res_bb(b1, b2){
    //     //collision normal vector
    //     let normal = b1.pos.subtr(b2.pos).unit();
    //     //relative velocity vector
    //     let relVel = b1.vel.subtr(b2.vel);
    //     //separating velocity - relVel projected onto the collision normal vector
    //     let sepVel = Vector.dot(relVel, normal);
    //     //the projection value after the collision (multiplied by -1)
    //     let new_sepVel = -sepVel;
    //     //collision normal vector with the magnitude of the new_sepVel
    //     let sepVelVec = normal.mult(new_sepVel);
    
    //     //adding the separating velocity vector to the original vel. vector
    //     b1.vel = b1.vel.add(sepVelVec);
    //     //adding its opposite to the other balls original vel. vector
    //     b2.vel = b2.vel.add(sepVelVec.mult(-1));
    // }
    

}