
class World {
    constructor(name) {
        // this.mainGame = mainGame;
        this.name = name

        this.world = false;
        this.objs  = [];
    }

    createWorld(){
        this.world = true;
    }

    addObject(obj) {
        this.objs.push(obj);
    }

    getObjects() {
        return this.objs;
    }

    verifyCollision() {
        if (Globals.isCollisions()) {
            for (let i = 0; i < this.objs.length; i++) {
                for (let j = i + 1; j < this.objs.length; j++) {
                    if (this.objs[i].id != this.objs[j].id) {
                        this.objs[i].collidesWith(this.objs[j]);
                    }
                }
            }
        }
    }
}