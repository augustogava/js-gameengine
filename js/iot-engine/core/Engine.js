class Engine {
    fpsHelper = 0;
    fps = 60;
    startTime;
    paused = true;
    resetTime = false;

    collisionGrid = null;
    ctxClearScreen = true;
    mousePos = new Vector(0, 0);

    constructor(gameObjectType) {
        Globals.setBoundaries(true);
        Globals.setCollisions(true);
        Globals.setDebug(false);

        this.setScreen();
        this.objs = [];
        this.lastTime = 0;

        this.debugger = new Debugger();
        this.gameObjectType = gameObjectType;

        this.interactions = new Interactions(canvas);

        this.gameLoop = this.gameLoop.bind(this);
        eventshelper.mousePos = new Vector(0, 0);

        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.accumulatedTime = 0;
    }

    init() {
        this.setScreen();
        this.userInteractions();

        this.gameObjectType.init();

        this.gameLoop();
    }

    startLoop() {
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(timestamp = 0) {
        if (!this.lastTime) this.lastTime = timestamp;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.accumulatedTime += deltaTime;

        while (this.accumulatedTime >= this.frameInterval) {
            const deltaTimeSeconds = this.frameInterval * 0.001;

            this.update(deltaTimeSeconds);
            this.accumulatedTime -= this.frameInterval;

            this.calculateFPS();
        }

        this.draw();

        if (this.paused) {
            if (this.resetTime) {
                this.lastTime = timestamp;
            }
            requestAnimationFrame(this.gameLoop);
        }
    }

    update(deltaTime) {
        this.gameObjectType.update(deltaTime);

        if (this.debugger && Utils.existsMethod(this.debugger.update)) {
            this.debugger.update();
        }

        const interactionState = this.interactions.getState();

        if (interactionState.mousePressed) {
            this.handleUserInteraction(interactionState);
        }

        this.interactions.resetLoop();
    }

    handleUserInteraction(interactionState) {
    }

    draw() {
        if (this.ctxClearScreen) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        this.gameObjectType.draw();

        this.addText(`${this.fps}`, canvas.width - 85, 20, 14, "black");
        for (let objIntte of this.objs) {
            if (Globals.isDebug()) {
            }
        }
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
        this.startLoop();
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
        this.startLoop();
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
