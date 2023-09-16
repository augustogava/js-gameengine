class ParticleNoiseObj extends ObjectMain {
    constructor(flow, position) {
        super(ParticleNoiseObj, null, position, null, null, null);

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
        this.speedModifier = 1.5;

        this.position = new Vector(Utils.randomIntFromInterval(10, canvas.width), Utils.randomIntFromInterval(10, canvas.height));
        this.velocity = new Vector(Math.random() * 1, Math.random() * 1);
        this.acceleration = new Vector(0, 0);

        this.history = [new Vector(this.position.getX(), this.position.getY())];
        this.maxLength = Math.floor(Math.random() * 100 + 10);
        this.timer = this.maxLength * 100 * 1.5;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
    }

    update() {
        this.timer--;

        if (this.timer > 1 && this.history.length > 0) {
            let x = Math.floor(this.position.getX() / this.flow.cellSize);
            let y = Math.floor(this.position.getY() / this.flow.cellSize);
            
            let index = x * this.flow.cols + y;
            
            if ( (!index || (index && index.length < 0) ) && this.flow.flowField[index]) {
                index = this.lastIndex ? this.lastIndex : 0;
                x = this.lastPosition.getX();
                y = this.lastPosition.getY();
            }
            
            this.field = this.flow.flowField[index];

            this.lastIndex = index;
            // this.length = this.field.getLength();
            
            this.lastIndex = index;

            this.velocity.multiplyBy(.9);
            this.acceleration.setAngle(this.field);

            this.velocity.addTo(this.acceleration);
            // this.velocity.addVal(this.length);

            this.position.addTo(this.velocity);
            this.lastPosition = this.position;

            this.history.push(new Vector(this.position.getX(), this.position.getY()));
            if (this.history.length > this.maxLength) {
                this.history.shift();
            } else {
                // this.reset();
            }
        } else {
            if (this.history.length > 0) {
                this.history.shift();
            }
        }
    }

    draw() {
        // var r = map(this.position.getX(), 0, canvas.width, 50, 255);
        // var g = map(this.position.getY(), 0, canvas.height, 50, 255);
        // var b = map(this.position.getX(), 0, canvas.width, 50, 255);
        // var alpha = map(dist(canvas.width/2, canvas.height/2, this.position.getX(), this.position.getY()), 0, 350, 255, 0);

        // var r = Utils.map(this.position.getX(), 0, canvas.width, 50, 255);
        // var g = Utils.map(this.position.getY(), 0, canvas.height, 50, 255);
        // var b = Utils.map(this.position.getX(), 0, canvas.width, 50, 255);
        // var alpha = Utils.map(Utils.map(canvas.width/2, canvas.height/2, this.position.getX(), this.position.getY()), 0, 350, 255, 0);
        // ctx.fill(r, g, b, 1);
        // ctx.strokeStyle = 'rgba(1,1,1,1)';

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.lineWidth = 1.2;
        let pos = this.history[0] ? this.history[0] : this.position;
        ctx.moveTo(pos.getX(), pos.getY());
        for (let i = 0; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].getX(), this.history[i].getY());
        }

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

class FlowField {
    particles = [];
    perlinNoise = null;

    constructor(perlinNoise) {
        this.perlinNoise = perlinNoise;
        this.numberOfParticles = 1000;
        this.cellSize = 35;
        this.rows = 1;
        this.cols = 1;
        this.zoom = 0.8;
        this.curve = 1.8;
        this.flowField = [];

        this.debug = true;
    }

    init() {
        this.rows = Math.floor(canvas.height / this.cellSize);
        this.cols = Math.floor(canvas.width / this.cellSize);

        this.flowField = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                let length = 1 ;// + (Math.random() * x) / 1;

                let v = new Vector(0, 0);
                v.setAngle(angle);
                v.setLength(length);
                //this.flowField.push(v);
                this.flowField.push(angle);
            }
        }

        this.particles = [];
        for (var i = 0; i < this.numberOfParticles; ++i) {
            this.particles.push(new ParticleNoiseObj(this));
        }
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

    drawGrid() {
        if (this.debug && this.flowField.length > 0) {
            let length = 8;

            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            for (let c = 0; c < this.cols; c++) {
                ctx.beginPath();
                ctx.moveTo((c * this.cellSize), 0);
                ctx.lineTo((c * this.cellSize), canvas.height);
                ctx.stroke();

                for (let r = 0; r < this.rows; r++) {
                    if (c == 0) {
                        ctx.beginPath();
                        ctx.moveTo(0, (r * this.cellSize));
                        ctx.lineTo(canvas.width, (r * this.cellSize));
                        ctx.stroke();
                    }

                    //length = f.getLength();
                    let index = r * this.cols + c;
                    var f = this.flowField[index];

                    let x = (c * this.cellSize) + this.cellSize / 2 - (0);
                    let y = (r * this.cellSize) + this.cellSize / 2 - (0);

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    //ctx.lineTo(x + length * Math.cos(f.getAngle()), y + length * Math.sin(f.getAngle()));
                    ctx.lineTo(x + length * Math.cos(f), y + length * Math.sin(f));

                    ctx.stroke();

                    // ctx.save();
                    // ctx.fillStyle = "white";
                    // ctx.font = "10px Arial";
                    // ctx.textAlign = "left";
                    // ctx.textBaseline = "top";
                    // ctx.fillText("Ind: " + (index), x - this.cellSize/2 + 5, y - this.cellSize /2 + 6);

                    // ctx.fillText("Po: " + Utils.round(position.getAngle() , 3 ) +
                    // // " - PL: " + Utils.round(position.getLength(), 3 ) + 
                    // " Ang:" + Math.round(f* 10000) / 10000, x - this.cellSize/2 + 5, y - this.cellSize /2 + 20);
                    // fieldctx.restore();
                }
            }
            ctx.restore();
        }
    }
}

class PerlinNoise {
    flows = [];
    flow = null;

    constructor() {
        this.flow = new FlowField(this);
    }

    init() {
        this.flow.init();
    }

    update() {
        this.flow.update();
    }

    draw() {
        this.flow.draw();
    }

    resize() {
        game.setScreen();
        this.flow.init();
    }

    userInteractions() {
        var that = game;

        canvas.addEventListener("click", event => {

        });

        document.addEventListener('mousemove', function (mouseMoveEvent) {
            that.mousePosition.x = mouseMoveEvent.pageX;
            that.mousePosition.y = mouseMoveEvent.pageY;

        }, false);


        document.addEventListener('keydown', (event) => {
            // if (event.code != 'KeyB' && event.code != 'KeyR' && event.code != 'KeyF' && event.code != 'KeyP' && event.code != 'KeyN') {
            //     return;
            // }

            if (event.code === 'KeyD') {
                this.flow.debug = !this.flow.debug;
            }
        });
    }
}