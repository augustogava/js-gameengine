const maxNumObjects = 10000;
const tableSize = 5 * maxNumObjects;

class SHash {
    constructor() {
        this.cellSize = 0;
        this.entCount = 0;
        this.pool = new Array(maxNumObjects).fill(0);
        this.cellStart = new Array(tableSize + 1).fill(0);
        this.cellEntries = new Array(maxNumObjects).fill(0);
        this.queryIds = new Array(500).fill(0);
    }

    static hashCoords(x, y) {
        const h = (x * 73856093) ^ (y * 83492791);
        return h % tableSize;
    }

    clear() {
        this.entCount = 0;
        this.pool.fill(0);
        this.cellStart.fill(0);
        this.cellEntries.fill(0);
    }

    add(id, x, y) {
        if (this.entCount < maxNumObjects) {
            const index = SHash.hashCoords(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
            this.cellStart[index]++;
            this.pool[this.entCount] = id;
            this.entCount = Math.min(this.entCount + 1, maxNumObjects - 1);
        }
    }

    process(cells) {
        let start = 0;
        for (let i = 0; i < tableSize; i++) {
            start += this.cellStart[i];
            this.cellStart[i] = start;
        }
        this.cellStart[tableSize] = start;

        for (let i = 0; i < this.entCount; i++) {
            const id = this.pool[i];
            const x = Math.floor(cells[id].x / this.cellSize);
            const y = Math.floor(cells[id].y / this.cellSize);
            const index = SHash.hashCoords(x, y);

            this.cellStart[index]--;
            this.cellEntries[this.cellStart[index]] = id;
        }
    }

    query(x, y, maxDist) {
        this.queryIds.fill(0);

        const x1 = Math.floor((x - maxDist) / this.cellSize);
        const y1 = Math.floor((y - maxDist) / this.cellSize);
        const x2 = Math.floor((x + maxDist) / this.cellSize);
        const y2 = Math.floor((y + maxDist) / this.cellSize);
        let querySize = 0;

        for (let xi = x1; xi <= x2; xi++) {
            for (let yi = y1; yi <= y2; yi++) {
                const index = SHash.hashCoords(xi, yi);
                const start = this.cellStart[index];
                const finish = this.cellStart[index + 1];

                for (let i = start; i < finish; i++) {
                    this.queryIds[querySize] = this.cellEntries[i];
                    querySize++;
                }
            }
        }

        return querySize;
    }
}






let damping = 0.001;
let cellhalf = cellsize * 0.5;

function processChunks(data) {
  let input = data[0];
  let output = data[1];
  let chunkdata = data[2];
  let posdata = data[3];
  let physdata = data[4];
  let coldata = data[5];
  let obj_count = data[6];

  let chunks = new DataView(chunkdata.buffer);
  let positions = new DataView(posdata.buffer);
  let physics = new DataView(physdata.buffer);
  let colors = new DataView(coldata.buffer);

  function setColor(i, r, g, b, a = 1) {
    colors.setFloat32(i, r);
    colors.setFloat32(i + 1, g);
    colors.setFloat32(i + 2, b);
    colors.setFloat32(i + 3, a);
  }

  let tmpx = 0;
  let tmpy = 0;
  let tmpa = 0;

  while (active) {
    obj_count = input.demand();

    for (let ci = 0; ci < chunkcount; ci++) {
      shash_clear(chunks[ci].hash);
    }

    for (let i = 0; i < obj_count; i++) {
      tmpx = positions.getFloat32(i);
      tmpy = positions.getFloat32(i + 1);
      tmpa = physics.getFloat32(i);

      positions.setFloat32(i, (2 - damping) * positions.getFloat32(i) - (1 - damping) * positions.getFloat32(i + 2));
      positions.setFloat32(i + 1, (2 - damping) * positions.getFloat32(i + 1) - (1 - damping) * positions.getFloat32(i + 3));
      physics.setFloat32(i, (2 - damping) * physics.getFloat32(i) - (1 - damping) * physics.getFloat32(i + 1));

      positions.setFloat32(i + 2, tmpx);
      positions.setFloat32(i + 3, tmpy);
      physics.setFloat32(i + 1, tmpa);

      let x1 = Math.floor((positions.getFloat32(i) - cellhalf) / cellscale);
      let y1 = Math.floor((positions.getFloat32(i + 1) - cellhalf) / cellscale);
      let x2 = Math.floor((positions.getFloat32(i) + cellhalf) / cellscale);
      let y2 = Math.floor((positions.getFloat32(i + 1) + cellhalf) / cellscale);

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          let ci = (y * cw + x) % chunkcount;
          shash_add(chunks[ci].hash, i, positions.getFloat32(i), positions.getFloat32(i + 1));

          setColor(i, chunks[ci].color.r, chunks[ci].color.g, chunks[ci].color.b);
        }
      }
    }

    output.push("done!");
  }
}

// Note: This translation assumes `shash_clear`, `shash_add`, `input.demand`, and `output.push` 
// are JavaScript functions or methods defined elsewhere in your application.
