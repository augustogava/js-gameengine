class Engine {
    fpsHelper = 0;
    fps = 60;

    startTime;
    followShape = false;
    selectedPolygon = undefined;
    paused = true;
    lastShapeUsed = "CIRCLE";
    resetTime = false;
    scalar = 2 * Utils.randomBoolean1orMinus1();

    physicsFriction = 0.99;
    ctxClearScreen = true;
    mousePos = new Vector(0, 0);
    mouseDownInitPosition = new Vector(0, 0);

    constructor(gameObjectType) {
        Globals.setBoundaries(false);
        Globals.setCollisions(true);
        Globals.setDebug(true);

        this.setScreen();
        this.objs = [];
        this.lastTime = 0;

        this.debugger = new Debugger();
        this.gameObjectType = gameObjectType;


        this.gameLoop = this.gameLoop.bind(this); // Binding the gameLoop to the current instance

    }

    init() {
        this.setScreen();
        this.userInteractions();

        this.gameObjectType.init();

        this.gameLoop(); 
    }

    starLoop() {
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(timestamp = 1) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = (timestamp - this.lastTime) * 0.001; // Convert to seconds

        this.update(deltaTime);
        this.draw();
        this.lastTime = timestamp;

        if (this.paused) {

            this.calculateFPS();
            if (this.resetTime) {
                this.lastTime = timestamp;
            }

            requestAnimationFrame(this.gameLoop);
        }
    }

    update(deltaTime) {
        this.gameObjectType.update(deltaTime);

        if( this.debugger && Utils.existsMethod( this.debugger.update) ){
            this.debugger.update();
        }
    }

    draw() {
        if (this.ctxClearScreen) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        this.gameObjectType.draw();

        this.addText(`${this.fps}`, canvas.width - 85, 20, 14, "black");
        for (let objIntte of this.objs) {
            //objIntte.draw();

            if (Globals.isDebug()) {
                //   objIntte.debug();
            }
        }

        // this.debug()
    }

    addText(t, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px Arial`;
        ctx.fillText("FPS: " + t + ".00", x, y);
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
        if (this.paused) {
            return;
        }

        console.log("resumeGameLoopState");
        this.resetTime = true;
        this.paused = true;
        this.starLoop();
    }

    pauseGameLoopState() {
        if (!this.paused) {
            return;
        }

        this.paused = false;
    }

    invertGameLoopState() {
        if (!this.paused) {
            this.resetTime = true;
        }

        this.paused = !this.paused;
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
        this.fpsHelper++;
        const currentTime = performance.now();

        if (this.startTime === undefined) this.startTime = currentTime;
        if (currentTime - this.startTime >= 1000) {
            this.fps = this.fpsHelper;
            this.fpsHelper = 0;
            this.startTime = currentTime;
        }
    }
}