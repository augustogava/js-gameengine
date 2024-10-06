class Grid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;

        this.cellSize = cellSize;
        this.cols = Math.floor(width / this.cellSize);
        this.rows = Math.floor(height / this.cellSize) + 1;

        this.grid = MathHelper.make2DArray(this.cols, this.rows);
        this.velocityGrid = MathHelper.make2DArray(this.cols, this.rows);

        this.visible = true;
    }

    getCellSize(){
        return new Vector(this.cellSize, this.cellSize);
    }

    toggleVisibility() {
        this.visible = !this.visible;
    }

    draw(context) {
        if (!this.visible) return;

        context.beginPath();
        context.strokeStyle = "#ccc";

        for (let x = 0; x <= this.width; x += this.cellSize) {
            context.moveTo(x, 0);
            context.lineTo(x, this.height);
        }

        for (let y = 0; y <= this.height; y += this.cellSize) {
            context.moveTo(0, y);
            context.lineTo(this.width, y);
        }

        context.stroke();
    }

    getCellForPosition(position) {
        const gridX = Math.floor(position.x / this.cellSize);
        const gridY = Math.floor(position.y / this.cellSize);
        return { gridX, gridY };
    }

    getCellCenter(gridX, gridY) {
        const x = gridX * this.cellSize + this.cellSize / 2;
        const y = gridY * this.cellSize + this.cellSize / 2;
        return new Vector(x, y);
    }

    isWithinBounds(position) {
        return position.x >= 0 && position.x+this.cellSize < this.width &&
            position.y >= 0 && position.y < this.height+this.cellSize;
    }

    snapToGrid(position) {
        const { gridX, gridY } = this.getCellForPosition(position);
        return this.getCellCenter(gridX, gridY);
    }

    getObjectsInCell(objects, gridX, gridY) {
        return objects.filter(obj => {
            const objGridPos = this.getCellForPosition(obj.position);
            return objGridPos.gridX === gridX && objGridPos.gridY === gridY;
        });
    }

    getSurroundingCells(position) {
        const { gridX, gridY } = this.getCellForPosition(position);
        let cells = [];
        for (let x = gridX - 1; x <= gridX + 1; x++) {
            for (let y = gridY - 1; y <= gridY + 1; y++) {
                if (this.isWithinBounds(new Vector(x * this.cellSize, y * this.cellSize))) {
                    cells.push({ gridX: x, gridY: y });
                }
            }
        }
        return cells;
    }

    withinCols(i) {
        return i >= 0 && i < this.cols;
    }

    withinRows(j) {
        return j >= 0 && j < this.rows;
    }
}
