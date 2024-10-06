
class Scene {
    constructor(g) {
        this.game = g;
        this.map = null;
        this.camera = null;
        this.inputUserInteractions = null;
        this.worlds = new HashTable();
        this.worldsNew = [];
        this.physicsComplex = new PhysicsComplex();

        if (Globals.getBoundaries()) {
            // this.createBoundaries();
        }
    }

    createWorld(n) {
        this.worlds.set(n, new World(n))
    }

    addWorldObj(name, obj) {
        if( !this.worlds.get(name) ){
            return ;
        }

        const w = this.worlds.get(name);
        w.addObject(obj);

        this.worlds.set(name, w)
    }

    getWorldObjs(name) {
        if( !this.worlds ){
            return [];
        }

        if( !this.worlds.get(name) ){
            return [];
        }

        return this.worlds.get(name).getObjects();
    }

    createUserInteractions() {
        this.inputUserInteractions = InputUserFieldInteractions.enableInputModification(game);
    }

    createMap() {
        this.map = new MapGame(this);
        this.map = new MapGame(this);
    }

    createCamera() {
        this.camera = new Camera(this, 0, 0);
    }

    createBoundaries() {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        let topBoundary = new Ground(this, 0, new Vector(0, 0), new Vector(canvasWidth, 0));
        let fixTop = new Fixture(topBoundary, 1);
        topBoundary.addFixture(fixTop);
        this.addWorldObj('main', topBoundary);

        let bottomBoundary = new Ground(this, 0, new Vector(0, canvasHeight), new Vector(canvasWidth, canvasHeight));
        let fixBottom = new Fixture(bottomBoundary, 1);
        bottomBoundary.addFixture(fixBottom);
        this.addWorldObj('main', bottomBoundary);

        let leftBoundary = new Ground(this, 0, new Vector(0, 0), new Vector(0, canvasHeight));
        let fixLeft = new Fixture(leftBoundary, 1);
        leftBoundary.addFixture(fixLeft);
        this.addWorldObj('main', leftBoundary);

        let rightBoundary = new Ground(this, 0, new Vector(canvasWidth, 0), new Vector(canvasWidth, canvasHeight));
        let fixRight = new Fixture(rightBoundary, 1);
        rightBoundary.addFixture(fixRight);
        this.addWorldObj('main', rightBoundary);
    }

    update(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.1);

        this.map.update(deltaTime);
        this.camera.update(deltaTime);

        for (let c of this.worlds.getAllObjects()) {
            c.update(deltaTime);
            c.verifyCollision(deltaTime);
        }

        if( eventshelper )
            eventshelper.resetLoop();
    }

    draw() {
        this.map.draw();

        for (let c of this.worlds.getAllObjects()) {
            c.draw();
        }
    }
}