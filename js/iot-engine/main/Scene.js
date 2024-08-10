
class Scene {
    constructor(g) {
        this.game = g;
        this.map = null;
        this.camera = null;
        this.inputUserInteractions = null;
        this.worlds = new HashTable();
        this.worldsNew = [];
        this.physicsComplex = new PhysicsComplex();
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
    }

    createCamera() {
        this.camera = new Camera(this, 0, 0);
    }

    update(deltaTime) {
        // console.log(canvas.wid);
        deltaTime = Math.min(deltaTime, 0.1);

        this.map.update(deltaTime);
        this.camera.update(deltaTime);

        for (let c of this.worlds.getAllObjcts()) {
            c.update(deltaTime);
            c.verifyCollision(deltaTime);
        }

        if( eventshelper )
            eventshelper.resetLoop();

    }

    draw() {
        this.map.draw();

        for (let c of this.worlds.getAllObjcts()) {
            c.draw();
        }
    }
}