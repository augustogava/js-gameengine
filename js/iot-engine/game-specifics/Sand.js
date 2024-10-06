class Sand extends BodyDef {
	constructor(rocketFake, x, y, mass, size) {
		super(Sand, mass, new Vector(x, y));
		this.rocketFake = rocketFake;
		this.physics = new Physics(this);
		this.size = size;

		this.bounce = 0;
		this.friction = 0;

		this.setBodyType('dynamic');

		this.shape = new Dot(x, y, size);
		this.shape.updateFieldUserInstance('shapeType', 'square');
		this.position = this.shape.getPosition();

		this.mass = mass;
		this.inertia = this.mass * this.shape.size ** 2 / 2;
		this.inv_inertia = this.mass === 0 ? 0 : 1 / this.inertia;

		this.velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
		this.initialized = false;

        this.gridMapRef = this.rocketFake.map.grid;

        this.cellSize = this.gridMapRef.cellSize;
        this.cols = this.gridMapRef.cols;
        this.rows = this.gridMapRef.rows;

        this.grid = MathHelper.make2DArray(this.cols, this.rows);
        this.velocityGrid = MathHelper.make2DArray(this.cols, this.rows, 1);
        this.gridGravity = 0.1;
        this.hueValue = 200;

        this.addSand();
    }

    update() {
        if (!this.nextGrid) {
            this.nextGrid = MathHelper.make2DArray(this.cols, this.rows);
            this.nextVelocityGrid = MathHelper.make2DArray(this.cols, this.rows);
        }

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.nextGrid[i][j] = 0;
                this.nextVelocityGrid[i][j] = 0;
            }
        }

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let state = this.grid[i][j];
                let velocity = this.velocityGrid[i][j];

                if (state > 0) {
                    let newY = Math.min(j + Math.floor(velocity), this.rows - 1);

                    if (newY > j && this.grid[i][newY] === 0) {
                        this.nextGrid[i][newY] = state;
                        this.nextVelocityGrid[i][newY] = velocity + this.gridGravity;
                    } else {
                        let dir = Math.random() < 0.5 ? 1 : -1;
                        if (this.gridMapRef.withinCols(i + dir) && this.grid[i + dir][j + 1] === 0) {
                            this.nextGrid[i + dir][j + 1] = state;
                            this.nextVelocityGrid[i + dir][j + 1] = velocity + this.gridGravity;
                        } else {
                            this.nextGrid[i][j] = state;
                            this.nextVelocityGrid[i][j] = velocity;
                        }
                    }
                }
            }
        }

        let tempGrid = this.grid;
        let tempVelocityGrid = this.velocityGrid;
        this.grid = this.nextGrid;
        this.velocityGrid = this.nextVelocityGrid;
        this.nextGrid = tempGrid;
        this.nextVelocityGrid = tempVelocityGrid;

        if (eventshelper.mousePressingDown()) {
            if (eventshelper.mousePos) {
                this.addSand(eventshelper.mousePos.x, eventshelper.mousePos.y, ( eventshelper.keyCode === 'ShiftLeft' ) );
            }
        }
    }

    draw() {
        ctx.beginPath();

        for (let i = 0; i < this.gridMapRef.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let state = this.grid[i][j];
                if (state > 0) {
                    let x = i * this.cellSize;
                    let y = j * this.cellSize;
                    ctx.fillStyle = `hsl(${state}, 100%, 50%)`;
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }

        ctx.closePath();
    }

    addSand(mouseX, mouseY, remove) {
        let mouseCol = Math.floor(mouseX / this.cellSize);
        let mouseRow = Math.floor(mouseY / this.cellSize);
        let matrix = 5;
        let extent = Math.floor(matrix / 2);

        let shiftPressed = remove;

        for (let i = -extent; i <= extent; i++) {
            for (let j = -extent; j <= extent; j++) {
                let col = mouseCol + i;
                let row = mouseRow + j;
                if (this.gridMapRef.withinCols(col) && this.gridMapRef.withinRows(row)) {
                    if (shiftPressed) {
                        this.grid[col][row] = 0;
                        this.velocityGrid[col][row] = 0;
                    } else {
                        if (Math.random() < 0.8) {
                            this.grid[col][row] = this.hueValue;
                            this.velocityGrid[col][row] = 0;
                        }
                    }
                }
            }
        }

        if (!shiftPressed) {
            this.hueValue += 0.3;
            if (this.hueValue > 360) {
                this.hueValue = 1;
            }
        }
    }

	intersects(otherShape) {
		return false;
	}
}
