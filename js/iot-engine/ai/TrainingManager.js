// js/iot-engine/ai/TrainingManager.js

class TrainingManager {
    constructor() {
        this.cells = [];
    }

    registerCell(cell) {
        this.cells.push(cell);
    }

    unregisterCell(cell) {
        this.cells = this.cells.filter(c => c !== cell);
    }

    update(deltaTime) {
        // Placeholder for any global training updates
    }

    trainAllCells() {
        this.cells.forEach(cell => {
            cell.brain.train();
        });
    }
}
