class Ball extends BodyDef {
    constructor(rocketFake, mass, radius, position) {
        super(Ball, mass, position);
        this.rocketFake = rocketFake;
        this.physics = new Physics(this);

        this.color = "black";

        this.setBodyType('dynamic');

        this.shape = new Circle(position, radius)
        this.bounce = 0;
        this.friction = .99;
        this.elasticity = .85;

        if (this.mass === 0) {
            this.inv_m = 0;
        } else {
            this.inv_m = 1 / this.mass;
        }

    }

    update(deltaTime) {
        this.reposition();
        // if (!this.mo) {
        //     this.acc = this.acc.unit().mult(this.acceleration);
        //     this.velocity = this.velocity.add(this.acc);
        //     this.velocity = this.velocity.mult(1 - this.friction);

        //     this.shape.position = this.shape.position.add(this.velocity);
        // }
        // this.velocity.addTo(this.acceleration);
        // this.velocity.multiplyBy(this.friction);

        // this.position.addTo(this.velocity);
        // this.lastPosition = this.position;

        // this.acceleration = new Vector(0, 0);
    }

    reposition() {
        // this.acc = this.acc.unit().mult(1);
        this.velocity = this.velocity.add(this.acceleration);
        // this.velocity = this.velocity.mult(1 - this.friction);

        this.shape.position.addTo(this.velocity);
    }

    draw() {
        this.shape.draw();
    }

    display() {
        this.velocity.drawVec(this.position.x, this.position.y, 10, "green");

        ctx.fillStyle = "red";
        ctx.fillText("m = " + this.mass, this.position.x - 10, this.position.y - 5);
        ctx.fillText("e = " + this.elasticity, this.position.x - 10, this.position.y + 5);
    }

    accel(v) {
        this.acceleration.addTo(new Vector(v, 0));
    }

    getSpeed() {
        return this.acceleration.getLength();
    }

    getSpeed2() {
        return this.velocity.getLength();
    }

    containsPoint(point) {
        return this.shape.position.distance(point) <= this.shape.radius;
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

            // if (eventshelper.keycode === 'KeyD') {
            //     this.throttle = true;
            //     this.break = false;
            //     this.accel(this.rocketFake.speed);
            // }

            // if (eventshelper.keycode === 'KeyA') {
            //     this.throttle = true;
            //     this.break = false;
            //     this.accel(-this.rocketFake.speed);
            // }

            // if (eventshelper.keycode === 'KeyS') {
            //     this.throttle = false;
            //     this.break = true;
            // }
        }

        if (this.isDragging()) {
            this.acc.x = 0;
            this.acc.y = 0;

            this.velocity.x = 0;
            this.velocity.y = 0;
            this.shape.position = eventshelper.mousepos;
        }

        if (eventshelper.mouseClickDown()) {
            // this.initImpulsePoint();
        }

        if (eventshelper.mouseRelease()) {
            // this.applyBoost();
        }
    }

    getInputFieldsConfig() {
        return {
            'Circle': [
                // { id: 'speed', label: 'Speed', type: 'number', value: this.getSpeed() },
                // { id: 'color', label: 'Color', type: 'color', value: this.color },
                { id: 'radius', label: 'Radius', type: 'number', value: this.shape.radius },
                { id: 'mass', label: 'Mass', type: 'number', value: this.mass },
                { id: 'elasticity', label: 'elasticity', type: 'number', value: this.elasticity },
                { id: 'positionX', label: 'Position X', type: 'number', value: this.shape.position.getX() },
                { id: 'positionY', label: 'Position Y', type: 'number', value: this.shape.position.getY() }
            ]
        };
    }

    updateFieldUserInstance(property, value) {
        this.updateFieldDynamic(property, value)
    }

    updateFieldDynamic(changedField, newValue) {
        if (this.hasOwnProperty(changedField)) {
            // Use bracket notation to set the value dynamically
            this[changedField] = newValue;

        } else {
            if (changedField == "radius") {
                this.shape.radius = newValue;
            }
            if (changedField == "positionX") {
                this.shape.position.x = newValue;
            }

            if (changedField == "positionY") {
                this.shape.position.y = newValue;
            }

        }

        this.updateConstraints();

    }











    // function pen_res_bb(b1, b2){
    //     let dist = b1.position.subtr(b2.pos);
    //     let pen_depth = b1.r + b2.r - dist.mag();
    //     let pen_res = dist.unit().mult(pen_depth/2);
    //     b1.pos = b1.position.add(pen_res);
    //     b2.pos = b2.position.add(pen_res.mult(-1));
    // }

    // //collision resolution
    // //calculates the balls new velocity vectors after the collision
    // function coll_res_bb(b1, b2){
    //     //collision normal vector
    //     let normal = b1.position.subtr(b2.pos).unit();
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