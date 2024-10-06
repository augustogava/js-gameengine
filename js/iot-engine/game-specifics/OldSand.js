// class Sand extends BodyDef {
// 	constructor(rocketFake, x, y, mass, size) {
// 		super(Sand, mass, new Vector(x, y));
// 		this.rocketFake = rocketFake;
// 		this.physics = new Physics(this);
// 		this.size = size;
//
// 		this.bounce = 0.1;
// 		this.friction = 0.8;
//
// 		this.setBodyType('dynamic');
//
// 		this.shape = new Dot(x, y, size);
// 		this.shape.updateFieldUserInstance('shapeType', 'square');
// 		this.position = this.shape.getPosition();
//
// 		this.mass = mass;
// 		this.inertia = this.mass * this.shape.size ** 2 / 2; // Adjusted calculation for inertia
// 		this.inv_inertia = this.mass === 0 ? 0 : 1 / this.inertia;
//
// 		this.velocity = new Vector(0, 0); // Set initial velocity to zero
// 		this.acceleration = new Vector(0, 0);
// 		this.initialized = false;
// 	}
//
// 	draw() {
// 		this.shape.draw(); // Draw the dot representing the sand
// 	}
//
// 	update(deltaTime) {
// 		if (this.isDragging()) {
// 			let delta = eventshelper.mousepos.subtract(this.getCenter());
// 			this.shape.position = delta;
// 			this.position = this.shape.getPosition();
// 		} else {
// 			let gravity = new Vector(0, 0.05);
// 			this.acceleration = gravity.clone();
//
// 			this.velocity = this.velocity.add(this.acceleration);
// 			let nextPosition = this.shape.position.add(this.velocity);
//
// 			var nextGridPosition = this.rocketFake.map.grid.snapToGrid(nextPosition);
//
// 			if( this.rocketFake.map.grid.isWithinBounds(nextGridPosition)){
// 				// this.shape.position = nextPosition;
// 				this.shape.position = nextGridPosition;
// 			}else{
// 				this.shape.position = this.shape.position;
// 			}
//
// 		}
// 		this.acceleration = new Vector(0, 0);
// 	}
//
// 	updateConstraints() {
//         // if ((this.shape.position.y + this.size) > canvas.height) {
//         //     this.shape.position.y = canvas.height - this.size;
//         //     this.velocity.y *= -this.bounce;
// 		// 	this.velocity.x *= (1 - this.friction);
// 		// }
// 		//
//         // if ((this.shape.position.y - this.size) < 0) {
//         //     this.shape.position.y = this.size;
//         //     this.velocity.y *= -this.bounce;
// 		// }
// 		//
//         // if ((this.shape.position.x + this.size) > canvas.width) {
//         //     this.shape.position.x = canvas.width - this.size;
//         //     this.velocity.x *= -this.bounce;
// 		// }
// 		//
//         // if ((this.shape.position.x - this.size) < 0) {
//         //     this.shape.position.x = this.size;
//         //     this.velocity.x *= -this.bounce;
// 		// }
// 		//
// 		// if (this.ground) {
//         //     let belowDistance = this.ground.below(this.shape.position, this.size);
// 		// 	if (belowDistance > 0) {
// 		// 		this.shape.position.y -= belowDistance; // Lift the ball up
//         //         this.velocity.y *= -this.bounce; // Reflect the y-velocity
// 		// 	}
// 		// }
// 	}
//
// 	userAction(key) {
// 		if (eventshelper.keycode) {
// 			if (eventshelper.keycode === 'ArrowLeft') {
// 				this.acceleration.addTo(new Vector(-0.5, 0));
// 			}
// 			if (eventshelper.keycode === 'ArrowRight') {
// 				this.acceleration.addTo(new Vector(0.5, 0));
// 			}
// 			if (eventshelper.keycode === 'ArrowUp') {
// 				this.acceleration.addTo(new Vector(0, -0.5));
// 			}
// 			if (eventshelper.keycode === 'ArrowDown') {
// 				this.acceleration.addTo(new Vector(0, 0.5));
// 			}
// 		}
// 	}
//
//     addSand() {
//         let mouseCol = Math.floor(mouseX / w);
//         let mouseRow = Math.floor(mouseY / w);
//         let matrix = 5; // Area around the mouse to add particles
//         let extent = Math.floor(matrix / 2);
//
//         for (let i = -extent; i <= extent; i++) {
//             for (let j = -extent; j <= extent; j++) {
//                 if (Math.random() < 0.75) { // Randomly add particles around the mouse
//                     let col = mouseCol + i;
//                     let row = mouseRow + j;
//                     if (grid.withinCols(col) && grid.withinRows(row)) {
//                         grid.grid[col][row] = hueValue; // Add particle to the grid
//                         grid.velocityGrid[col][row] = 1; // Set initial velocity
//                     }
//                 }
//             }
//         }
//
//         hueValue += 0.5; // Change color over time
//         if (hueValue > 360) {
//             hueValue = 1; // Reset hue if it exceeds maximum
//         }
//     }
//
// 	getInputFieldsConfig() {
// 		return {
// 			'Dot': [
// 				{ id: 'color', label: 'Color', type: 'color', value: this.color },
// 				{ id: 'size', label: 'Size', type: 'number', value: this.size },
// 				{ id: 'positionX', label: 'Position X', type: 'number', value: this.position.getX() },
// 				{ id: 'positionY', label: 'Position Y', type: 'number', value: this.position.getY() }
// 			]
// 		};
// 	}
//
// 	updateFieldUserInstance(property, value) {
// 		if (property === 'color') {
// 			this.color = value;
// 			ctx.fillStyle = value;
// 		} else if (property === 'size') {
// 			this.shape.size = value;
// 		} else if (property === 'positionX') {
// 			this.position.setX(value);
// 			this.shape.position.setX(value);
// 		} else if (property === 'positionY') {
// 			this.position.setY(value);
// 			this.shape.position.setY(value);
// 		}
// 	}
//
// 	intersects(otherShape) {
// 		return false;
// 	}
// }
