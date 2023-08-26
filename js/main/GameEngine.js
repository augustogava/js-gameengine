
class GameEngine {
    constructor(g) {
        this.map = null;
        this.camera = null;

        this.worlds = new HashTable();
        this.game = g;

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

    createMap() {
        this.map = new MapGame(this);
    }

    createCamera() {
        this.camera = new Camera(this, 0, 0);
    }

    update() {
        this.map.update();
        this.camera.update();

        for (let c of this.getWorldObjs('main')) {
            c.update();
        }
    }

    draw() {
        this.map.draw();

        for (let c of this.getWorldObjs('main')) {
            c.draw();
        }
    }
}