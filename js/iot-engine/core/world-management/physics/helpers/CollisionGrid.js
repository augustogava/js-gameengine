class CollisionCell {
    constructor() {
        this.objects = [];
        this.objects_count = 0;
    }

    addAtom(id) {
        // Remove the condition limiting the number of objects
        this.objects[this.objects_count] = id;
        this.objects_count += 1;
    }


    clear() {
        this.objects_count = 0;
        this.objects = [];
    }

    remove(id) {
        for (let i = 0; i < this.objects_count; ++i) {
            if (this.objects[i] === id) {
                this.objects[i] = this.objects[this.objects_count - 1];
                this.objects_count -= 1;
                return;
            }
        }
    }
}

class CollisionGrid {
    constructor(w, h, qtd) {
        this.data = [];
        this.qtd = qtd;
        this.widthStepValue = w / qtd;
        this.heightStepValue = h / qtd;

        for (let i = 0; i < qtd; ++i) {
            let row = [];
            for (let e = 0; e < qtd; ++e) {
                row.push(new CollisionCell());
            }
            this.data.push(row);
        }
    }

    update() {

    }

    addAtom(x, y, radius, atom) {
        // Calculate the range of cells that the object overlaps
        const minCellX = Math.max(0, Math.floor((x - radius) / this.widthStepValue));
        const maxCellX = Math.min(this.qtd - 1, Math.floor((x + radius) / this.widthStepValue));
        const minCellY = Math.max(0, Math.floor((y - radius) / this.heightStepValue));
        const maxCellY = Math.min(this.qtd - 1, Math.floor((y + radius) / this.heightStepValue));

        // Add the object to all the cells it overlaps
        for (let i = minCellX; i <= maxCellX; i++) {
            for (let j = minCellY; j <= maxCellY; j++) {
                this.data[i][j].addAtom(atom);
            }
        }
    }

    getNearbyCells(x, y, radius) {
        // Determine the range of cells to check for collisions
        const minCellX = Math.max(0, Math.floor((x - radius) / this.widthStepValue));
        const maxCellX = Math.min(this.qtd - 1, Math.floor((x + radius) / this.widthStepValue));
        const minCellY = Math.max(0, Math.floor((y - radius) / this.heightStepValue));
        const maxCellY = Math.min(this.qtd - 1, Math.floor((y + radius) / this.heightStepValue));

        const nearbyCells = [];
        for (let i = minCellX; i <= maxCellX; i++) {
            for (let j = minCellY; j <= maxCellY; j++) {
                nearbyCells.push(this.data[i][j]);
            }
        }
        return nearbyCells;
    }


}
