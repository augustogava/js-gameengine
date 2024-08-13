class Ball extends BodyDef {
    constructor(rocketFake, mass, radius, position) {
        super(Ball, mass, position);
        this.rocketFake = rocketFake;
        this.physics = new Physics(this);

        this.color = "black";
        this.setBodyType('dynamic');

        this.shape = new Circle(new Vector(position.x, position.y), radius);

        this.bounce = 0;
        this.friction = 0.99;
        this.elasticity = 0.85;

        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        if (this.mass === 0) {
            this.inv_m = 0;
        } else {
            this.inv_m = 1 / this.mass;
        }
    }

    update(deltaTime) {
        this.reposition();
    }

    reposition() {
        if (this.velocity && this.acceleration) {
            this.velocity = this.velocity.add(this.acceleration);
            if (this.shape && this.shape.position instanceof Vector) {
                this.shape.position.addTo(this.velocity);
            }
        }
        this.acceleration = new Vector(0, 0); // Reset acceleration after applying it
    }

    draw() {
        if (this.shape && this.shape.position instanceof Vector) {
            this.shape.draw();
        } else {
            console.error("Shape or shape position is invalid.");
        }
    }

    display() {
        if (this.velocity && this.shape && this.shape.position instanceof Vector) {
            this.velocity.drawVec(this.shape.position.getX(), this.shape.position.getY(), 10, "green");

            ctx.fillStyle = "red";
            ctx.fillText("m = " + this.mass, this.shape.position.getX() - 10, this.shape.position.getY() - 5);
            ctx.fillText("e = " + this.elasticity, this.shape.position.getX() - 10, this.shape.position.getY() + 5);
        }
    }

    accel(v) {
        if (this.acceleration) {
            this.acceleration.addTo(new Vector(v, 0));
        }
    }

    getSpeed() {
        return this.acceleration ? this.acceleration.getLength() : 0;
    }

    getSpeed2() {
        return this.velocity ? this.velocity.getLength() : 0;
    }

    containsPoint(point) {
        if (!this.shape || !(this.shape.position instanceof Vector)) {
            console.error("Shape or shape position is not a valid Vector in containsPoint method.");
            return false;
        }
    
        if (!(point instanceof Vector)) {
            console.error("Point passed to containsPoint is not a valid Vector.");
            return false;
        }
    
        return this.shape.position.distance(point) <= this.shape.radius;
    }
    

    userAction() {
        if (eventshelper.keyCode) {
            if (eventshelper.keyCode === 'ArrowLeft') {
                this.acceleration.addTo(new Vector(-1, 0));
            }

            if (eventshelper.keyCode === 'ArrowRight') {
                this.acceleration.addTo(new Vector(1, 0));
            }

            if (eventshelper.keyCode === 'ArrowUp') {
                this.acceleration.addTo(new Vector(0, -1));
            }

            if (eventshelper.keyCode === 'ArrowDown') {
                this.acceleration.addTo(new Vector(0, 1));
            }
        }

        if (this.isDragging()) {
            this.acc.x = 0;
            this.acc.y = 0;

            this.velocity.x = 0;
            this.velocity.y = 0;
            this.shape.position = eventshelper.mousePos;
        }

        if (eventshelper.mouseClickDown()) {
            // Handle logic for mouse click down
        }

        if (eventshelper.mouseRelease()) {
            // Handle logic for mouse release
        }
    }

    getInputFieldsConfig() {
        return {
            'Circle': [
                { id: 'radius', label: 'Radius', type: 'number', value: this.shape.radius },
                { id: 'mass', label: 'Mass', type: 'number', value: this.mass },
                { id: 'elasticity', label: 'Elasticity', type: 'number', value: this.elasticity },
                { id: 'positionX', label: 'Position X', type: 'number', value: this.shape.position.getX() },
                { id: 'positionY', label: 'Position Y', type: 'number', value: this.shape.position.getY() }
            ]
        };
    }

    updateFieldUserInstance(property, value) {
        this.updateFieldDynamic(property, value);
    }

    updateFieldDynamic(changedField, newValue) {
        if (this.hasOwnProperty(changedField)) {
            this[changedField] = newValue;
        } else {
            if (changedField === "radius") {
                this.shape.radius = newValue;
            }
            if (changedField === "positionX" && this.shape.position instanceof Vector) {
                this.shape.position.x = newValue;
            }
            if (changedField === "positionY" && this.shape.position instanceof Vector) {
                this.shape.position.y = newValue;
            }
        }
        this.updateConstraints();
    }
}
