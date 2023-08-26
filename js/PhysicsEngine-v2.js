class P extends ObjectMain {
    constructor(flow, position) {
        super(P, null, position, null, null, null);

        this.colors = ['#4c026b', 'white', , '#9622c7'];
        this.color = this.colors[Utils.randomIntFromInterval(0, 2)];
        this.flow = flow;

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.init();
    }

    reset() {
        this.init();
    }

    init() {
        // this.speedModifier = Math.floor(Math.random() * 5 + 1);
        this.color = this.colors[Utils.randomIntFromInterval(0, 2)];

        this.position = new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
        this.velocity = new Vector(Math.random() * 1, Math.random() * 1);
        this.acceleration = new Vector(0, 0);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
    }

    update() {
      

    }

    draw() {
        // var r = map(this.position.getX(), 0, canvas.width, 50, 255);
        // var g = map(this.position.getY(), 0, canvas.height, 50, 255);
        // var b = map(this.position.getX(), 0, canvas.width, 50, 255);
        // var alpha = map(dist(canvas.width/2, canvas.height/2, this.position.getX(), this.position.getY()), 0, 350, 255, 0);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.lineWidth = 1.4;
        let pos = this.position
        ctx.moveTo(pos.getX(), pos.getY());
        

        // if( this.flow.debug ){
        //     ctx.save();
        //     ctx.fillStyle = "white";
        //     ctx.font = "13px Arial";
        //     ctx.textAlign = "left";
        //     ctx.textBaseline = "top";
        //     ctx.fillText("Angle:" + Math.round(this.angle * 1000) / 1000, this.history[0].getX(), this.history[0].getY() - 20);
        //     ctx.restore();
        // }

        ctx.stroke();
    }
}

class PhysicsEngineV2 {
    particles = [];

    constructor(engine) {
        this.engine = engine;
        this.debug = false;
        this.numberOfParticles = 1
    }

    init() {
        this.rows = Math.floor(canvas.height / this.cellSize);
        this.cols = Math.floor(canvas.width / this.cellSize);

        this.particles = [];
        // for (var i = 0; i < this.numberOfParticles; ++i) {
        //     this.particles.push(new ParticleNoiseObj(this));
        // }
    }

    addParticle(){
        this.particles.push(new P(this));
    }

    update() {
        if (!this.particles)
            return;

        for (const p of this.particles) {
            p.update();
        }
    }

    draw() {
        this.drawGrid()

        if (!this.particles || this.particles.length == 0)
            return;

        for (const p of this.particles) {
            p.draw();
        }
    }

    resize() {
        game.setScreen();
        this.flow.init();
    }

    userInteractions() {
        var that = game;

        canvas.addEventListener("click", event => {
            that.addParticle();
        });

        document.addEventListener('mousemove', function (mouseMoveEvent) {
            that.mousePosition.x = mouseMoveEvent.pageX;
            that.mousePosition.y = mouseMoveEvent.pageY;

        }, false);


        // document.addEventListener('keydown', (event) => {
        //     if (event.code === 'KeyD') {
        //         this.debug = !this.debug;
        //     });
        

        // function love.keypressed( key, scancode, isrepeat )
        //     if key == 'escape' then love.event.quit() end
        // end

        // function love.mousemoved( x,y, dx,dy, istouch )
        //     x,y = camera:getScreenPos( x,y )
        //     if lm.isDown(3) then
        //         camera:move( dx,dy )
        //     end
        // end

        // function love.wheelmoved( x,y )
        //     camera:zoom(y)
        // end

        // function love.mousepressed( x,y, key, istouch, presses )
        //     x,y = camera:getScreenPos( x,y )
        // end

    }
}









// - - - - - - - - - - - - - - - - - - - - - - - - 
// - - - - - - - - -  COLISSION LUA - - - - - - - - - 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// function setColor(i, r, g, b, a = 1) {
//     colors[i].r = r;
//     colors[i].g = g;
//     colors[i].b = b;
//     colors[i].a = a;
//   }
  
//   function push(i, dx, dy) {
//     positions[i].x += dx;
//     positions[i].y += dy;
//   }
  
//   // Assuming input and output are some predefined objects with specific methods
//   let index = input.demand();
  
//   let half = chunkcount * delimeter;
//   let start = half * index;
//   let finish = start + half - 1;
  
//   while (active) {
//     active = input.demand();
  
//     for (let ci = start; ci <= finish; ci++) {
//       shash_process(chunks[ci].hash, positions);
  
//       for (let u = 0; u < chunks[ci].hash.entCount; u++) {
//         let i = chunks[ci].hash.pool[u];
  
//         let found = shash_query(chunks[ci].hash, positions[i].x, positions[i].y, qr);
//         for (let f = 0; f < found; f++) {
//           let j = chunks[ci].hash.queryIds[f];
//           if (j !== i) {
//             let dx = positions[i].x - positions[j].x;
//             let dy = positions[i].y - positions[j].y;
  
//             let cd = dx * dx + dy * dy;
//             let r = physics[i].radius + physics[j].radius;
  
//             if (cd <= r * r) {
//               cd = Math.sqrt(cd);
//               let cr = r - cd;
  
//               // Collisions without taking into account the mass of objects
//               [dx, dy] = [dx / cd * 0.5, dy / cd * 0.5];
//               push(i, dx * cr, dy * cr);
//               push(j, -dx * cr, -dy * cr);
  
//               // Collisions taking into account the mass of objects
//               // Commented out as they were commented in the original Lua code
//               /*
//               [dx, dy] = [dx / cd, dy / cd];
//               let mm = physics[i].mass + physics[j].mass;
//               let m1 = physics[j].mass / mm;
//               let m2 = physics[i].mass / mm;
  
//               push(i, dx * cr * m1, dy * cr * m1);
//               push(j, -dx * cr * m2, -dy * cr * m2);
//               */
  
//               // Color change in collision 
//               // Commented out as they were commented in the original Lua code
//               // setColor(i, 1, 0.9, 0.01);
//               // setColor(j, 1, 0.9, 0.01);
//             }
//           }
//         }
//       }
//     }
  
//     output.push(true);
//   }
  









// const maxNumObjects = 10000;
// const tableSize = 5 * maxNumObjects;

// class SHash {
//   constructor() {
//     this.cellSize = 0;
//     this.entCount = 0;
//     this.pool = new Array(maxNumObjects).fill(0);
//     this.cellStart = new Array(tableSize + 1).fill(0);
//     this.cellEntries = new Array(maxNumObjects).fill(0);
//     this.queryIds = new Array(500).fill(0);
//   }

//   static hashCoords(x, y) {
//     const h = (x * 73856093) ^ (y * 83492791);
//     return h % tableSize;
//   }

//   clear() {
//     this.entCount = 0;
//     this.pool.fill(0);
//     this.cellStart.fill(0);
//     this.cellEntries.fill(0);
//   }

//   add(id, x, y) {
//     if (this.entCount < maxNumObjects) {
//       const index = SHash.hashCoords(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
//       this.cellStart[index]++;
//       this.pool[this.entCount] = id;
//       this.entCount = Math.min(this.entCount + 1, maxNumObjects - 1);
//     }
//   }

//   process(cells) {
//     let start = 0;
//     for (let i = 0; i < tableSize; i++) {
//       start += this.cellStart[i];
//       this.cellStart[i] = start;
//     }
//     this.cellStart[tableSize] = start;

//     for (let i = 0; i < this.entCount; i++) {
//       const id = this.pool[i];
//       const x = Math.floor(cells[id].x / this.cellSize);
//       const y = Math.floor(cells[id].y / this.cellSize);
//       const index = SHash.hashCoords(x, y);

//       this.cellStart[index]--;
//       this.cellEntries[this.cellStart[index]] = id;
//     }
//   }

//   query(x, y, maxDist) {
//     this.queryIds.fill(0);

//     const x1 = Math.floor((x - maxDist) / this.cellSize);
//     const y1 = Math.floor((y - maxDist) / this.cellSize);
//     const x2 = Math.floor((x + maxDist) / this.cellSize);
//     const y2 = Math.floor((y + maxDist) / this.cellSize);
//     let querySize = 0;

//     for (let xi = x1; xi <= x2; xi++) {
//       for (let yi = y1; yi <= y2; yi++) {
//         const index = SHash.hashCoords(xi, yi);
//         const start = this.cellStart[index];
//         const finish = this.cellStart[index + 1];

//         for (let i = start; i < finish; i++) {
//           this.queryIds[querySize] = this.cellEntries[i];
//           querySize++;
//         }
//       }
//     }

//     return querySize;
//   }
// }