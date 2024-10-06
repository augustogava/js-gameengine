class OldEngine_perlin {
    frameCount = 0;
    fps = 200;
    startTime;
    followShape = false;
    selectedPolygon = undefined;
    animationRunning = true;
    lastShapeUsed = "CIRCLE";
    resetTime = false;
    scalar = 2 * Utils.randomBoolean1orMinus1();

    physicsFriction = 0.99;
    ctxClearScreen = true;
    mousePos = new Vector(0, 0);
    mouseDownInitPosition = new Vector(0, 0);

    constructor(gameObjectType) {
        this.mousePosition = { x: 0, y: 0 };
        Globals.setBoundaries(true);
        Globals.setCollisions(true);
        Globals.setDebug(true);

        this.setScreen();
        this.objs = [];
        this.prevTime = 0;

        this.debugger = new Debugger();

        this.gameObjectType = gameObjectType;
    }

    init() {
        this.setScreen();
        this.userInteractions();

        this.gameObjectType.init();
        this.starLoop();

        if (Globals.isCollisions()) {
            this.collisionGrid = new CollisionGrid(canvas.width, canvas.height, 2);
        }
    }

    starLoop() {
        this.gameLoop();
    }

    gameLoop(time) {
        this.calculateFPS();

        if (this.resetTime) {
            this.prevTime = time; this.resetTime = false;
        }

        let deltaTime = (time - this.prevTime) * 10;
        this.prevTime = time;

        this.update(deltaTime);
        this.draw();

        this.debugger.update();

        if (this.animationRunning)
            requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        for (const obj of this.objs) {
            obj.update(deltaTime);
        }

        this.gameObjectType.update(deltaTime);
    }

    draw() {
        if (this.ctxClearScreen) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        this.addText(`${this.fps}`, 10, 20, 15, "white");
        for (let objIntte of this.objs) {
            //objIntte.draw();

            if (Globals.isDebug()) {
                //   objIntte.debug();
            }
        }

        this.gameObjectType.draw();
        // this.debug()
    }

    addText(t, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px normal`;
        ctx.fillText(t, x, y);
    }

    setScreen() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.centerX = canvas.width / 2;
        canvas.centerY = canvas.height / 2;
    }

    userInteractions() {
        var that = this;
        window.addEventListener("blur", function (e) {
            that.pauseGameLoopState();
        });

        window.addEventListener("focus", function (e) {
            that.resumeGameLoopState();
        });

        window.addEventListener("resize", function () {
            that.setScreen();
            that.gameObjectType.resize();
        }, false);

        this.gameObjectType.userInteractions();
    }

    resumeGameLoopState() {
        if (this.animationRunning) {
            return;
        }

        console.log("resumeGameLoopState");
        this.resetTime = true;
        this.animationRunning = true;
        this.starLoop();
    }

    pauseGameLoopState() {
        if (!this.animationRunning) {
            return;
        }

        this.animationRunning = false;
    }

    invertGameLoopState() {
        if (!this.animationRunning) {
            this.resetTime = true;
        }

        this.animationRunning = !this.animationRunning;
        this.starLoop();
    }

    updateFollowObject() {
        if (this.followShape && this.objs && this.objs.length > 0 && this.selectedPolygon >= 0) {
            let retObj = this.objs[this.selectedPolygon];
            retObj.update(1);
            retObj.updatePosition(new Vector(eventshelper.mousepos.x, eventshelper.mousepos.y));
        }
    }

    transformCodeToShapeType(code) {
        if (code === undefined || code === 'KeyB')
            return "CIRCLE";

        if (code === 'KeyR')
            return "SQUARE";
    }

    addObject(obj) {
        this.objs.push(obj);
    }

    addShape(shapeType) {
        const rect = canvas.getBoundingClientRect();
        const midpoint = canvas.height / 2;

        const x = eventshelper.mousepos.x;
        const y = eventshelper.mousepos.y;

        const normalizedX = x / midpoint;
        const size = Utils.randomIntFromInterval(15, 40);
        const mass = Utils.randomIntFromInterval(10, 10) * size / 100;

        if (shapeType == "CIRCLE") {
            this.lastShapeUsed = "CIRCLE";

            this.addObject(new Circle(new Vector(x, y), mass, size, 0, 5, Math.random() * Math.PI * 2));
        } if (shapeType == "SQUARE") {
            this.lastShapeUsed = "SQUARE";

            this.addObject(new Rectangle(new Vector(x, y), new Vector(this.scalar * normalizedX, 0), 1, 150, 25));
        } if (shapeType == "STICK") {
            this.lastShapeUsed = "STICK";

            this.addObject(new Sticks(new Vector(x, y), new Vector(0, 0), 1, 150, 50));
        }
    }

    getObjects() {
        return this.objs;
    }

    calculateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        if (this.startTime === undefined) this.startTime = currentTime;
        if (currentTime - this.startTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.startTime = currentTime;
        }
    }
}