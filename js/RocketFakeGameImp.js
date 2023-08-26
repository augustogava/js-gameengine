class Player extends Body {
    constructor(rocketFake, position) {
        super(Player, null, position, null, null, null);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        this.boost = false;
        this.rocketFake = rocketFake;
        this.color = "#FC6C64";
        this.position = position;
        this.direction = new Vector(0, 0);
        this.force = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.directionBoost = new Vector(0, 0);

        this.forceCalculated = 0;

        this.radius = 40;
        this.angle = 0

        this.maxForceDistanceEvaluator = 40;
        this.directionLenth = 130;

        this.topSpeed = 25;

        this.gamePhysics = new Physics(this);
        this.imgLoad = false;
        this.img = new Image();
        this.img.src = '../images/rocket/car.jpg';
        var that = this;
        this.img.onload = () => {
            that.this.imgLoad = true;
            this.draw();
        }

        this.camerabox = {
            position: new Vector(this.position.getX(), this.position.getY()),
            width: 200,
            height: 200
        }

        this.init();
    }

    reset() {
        this.init();
    }

    init() {
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    accel(v) {
        if (this.getSpeed() > 3 || (canvas.height - this.position.getY() - this.radius > 25)) {
            this.throttle = false;
            this.rocketFake.throttle = false;
            return;
        }

        this.throttle = true;
        this.acceleration.addTo(new Vector(v, 0));
    }

    getSpeed() {
        return this.acceleration.getLength();
    }

    applyBoost(v) {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }
        let f = this.forceMouseDown.addValBy(10).multiplyBy(0.2).getLength();
        if (f > this.maxForceDistanceEvaluator)
            f = this.maxForceDistanceEvaluator;

        this.forceCalculated = Math.abs(f);

        if (this.forceCalculated <= 0.1 || !this.direction) {
            this.forceCalculated = 0;
            this.boost = false;
            return;
        }

        if (this.forceCalculated > this.maxForceDistanceEvaluator) {
            this.forceCalculated = this.maxForceDistanceEvaluator;
        }

        let mn = this.direction.normalize();
        mn.multiplyBy(this.forceCalculated);

        console.log(this.forceCalculated)
        this.acceleration.addTo(mn.multiplyBy(.3));
        this.forceCalculated = 0;
        this.boost = false;
    }

    initBoost(v) {
        if (canvas.height - this.position.getY() - this.radius > 15) {
            return;
        }

        this.directionBoost = game.mousePos.subtract(this.position);
        this.boost = true;
    }

    updatecamerabox() {
        this.camerabox = {
            position: new Vector(this.position.getX(), this.position.getY()),
            width: 400,
            height: 200
        }

        this.rocketFake.camera.updateCameraPlayer(this);
    }

    update() {


        if (!this.rocketFake.throttle && this.rocketFake.break) {
            this.acceleration.multiplyBy(.7);
        }

        this.acceleration.multiplyBy(.9);
        this.gamePhysics.update();

        this.velocity.addTo(this.acceleration);

        this.position.addTo(this.velocity);
        this.lastPosition = this.position;

        this.direction = game.mousePos.subtract(this.position);
        this.force = game.mousePos.subtract(this.position);
        this.forceMouseDown = game.mousePos.subtract(game.mouseDownInitPosition);

        this.updatecamerabox();

        if (Globals.getBoundaries()) {
            if (this.position.y + this.radius >= canvas.height) {
                this.position.y = canvas.height - this.radius;

                this.acceleration.y = this.acceleration.y * -1;
                this.velocity.y = this.velocity.y * -1;

                // if( !this.throttle  ) {
                this.velocity.multiplyBy(.9);
                // }
            }

            if (this.position.y - this.radius <= 0) {
                this.position.y = this.radius;
                this.velocity.y = this.velocity.y * -1;
                this.velocity.multiplyBy(.9);
            }

            if (this.position.x + this.radius >= canvas.width) {
                this.position.x = canvas.width - this.radius;
                this.velocity.x = this.velocity.x * -1;
                this.acceleration.x = this.acceleration.x * -1;
                this.velocity.multiplyBy(.9);
            }

            if (this.position.x - this.radius <= 0) {
                this.position.x = 0 + this.radius;
                this.velocity.x = this.velocity.x * -1;
                this.acceleration.x = this.acceleration.x * -1;
                this.velocity.multiplyBy(.9);
            }
        }

        // this.throttle = false;
    }

    draw() {
        // ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        if (this.imgLoad) {
            ctx.drawImage(this.img, 0, 0);
        }
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.closePath();

        this.drawDirection();
        this.drawForce();

        if (Globals.isDebug()) {
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            // ctx.fillText("Direct X: " + this.direction.normalize().getAngle() + " Y: " + this.direction.normalize().getLength(), this.position.getX() - 70, this.position.getY() - this.radius - 55);

            ctx.fillText("Accele:" + this.acceleration.getLength() + " | Thottle:" + this.rocketFake.throttle + " Force:" + this.forceCalculated, this.position.getX() - 50, this.position.getY() - this.radius - 30);
            ctx.restore();
        }

        ctx.fillStyle = 'rgba(0,0,255,0.2)';
        ctx.fillRect(this.camerabox.position.getX() - this.camerabox.width / 2,
            this.camerabox.position.getY() - this.camerabox.height / 2,
            this.camerabox.width,
            this.camerabox.height);

    }

    drawDirection() {
        let mn = this.direction.normalize();
        mn.multiplyBy(this.directionLenth);

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.moveTo(this.position.getX(), this.position.getY());
        ctx.lineTo(this.position.getX() + mn.getX(), this.position.getY() + mn.getY());
        ctx.strokeStyle = '#1AA7EC';
        ctx.stroke();
    }

    drawForce() {
        if (game.isMouseDown) {
            let mn = this.forceMouseDown.normalize();
            let f = this.forceMouseDown.addValBy(10).multiplyBy(0.2).getLength();
            if (f > this.maxForceDistanceEvaluator)
                f = this.maxForceDistanceEvaluator;

            ctx.beginPath();
            ctx.moveTo(this.position.getX(), this.position.getY());
            // ctx.lineTo(this.position.getX() + mn.getX() * f, this.position.getY() - 5   );
            ctx.lineTo(this.position.getX() + mn.getX() * f, this.position.getY() + mn.getY() * f);
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = "3";
            ctx.stroke();
        }

    }

    isPointInCircle(p1, r, p2) {
        return Math.abs((p1.getX() - p2.getX()) * (p1.getX() - p2.getX()) + (p1.getY() - p2.getY()) * (p1.getY() - p2.getY())) < (r * r);
    }

    OverlapCircle(p1, r, p2) {
        return Math.abs((p1.getX() - p2.getX()) * (p1.getX() - p2.getX()) + (p1.getY() - p2.getY()) * (p1.getY() - p2.getY())) < ((r + r2) * (r + r2));
    }
}

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}

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
        this.map = new Map(this);
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
        this.camera.draw();

        for (let c of this.getWorldObjs('main')) {
            c.draw();
        }
    }
}

class RocketFakeGameImp extends GameEngine {
    constructor() {
        super(RocketFakeGameImp);

        this.speed = .55;

        this.createWorld('main');

        this.createMap();
        this.createCamera();

        this.players = [];
        this.npc = [];

        this.throttle = false;
        this.break = false;
        this.boost = false;

        this.addWorldObj('main', new Player(this, new Vector(400, canvas.height - 100)));

    }

    init() {

    }

    accel(v) {
        for (let c of this.getWorldObjs('main')) {
            c.accel(v);
        }
    }

    initBoost() {
        for (let c of this.getWorldObjs('main')) {
            c.initBoost();
        }
    }

    applyBoost(v) {
        for (let c of this.getWorldObjs('main')) {
            c.applyBoost(v);
        }
    }

    update() {


    }

    draw() {

    }

    resize() {
        game.setScreen();
    }

    userInteractions() {
        var that = game;
        var thatRocket = this;

        canvas.addEventListener("click", event => {
            event.preventDefault();
        });

        document.addEventListener('mousemove', function (mouseMoveEvent) {
        }, false);

        document.addEventListener('mouseup', function (mouseMoveEvent) {
            thatRocket.applyBoost(0);
        }, false);

        document.addEventListener('mousedown', function (mouseMoveEvent) {
            event.preventDefault();
            thatRocket.initBoost();

        }, false);

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'd':
                    event.preventDefault(); keys.d.pressed = true;
                    break;
            }

            if (event.code === 'KeyD') {
                event.preventDefault(); thatRocket.throttle = true;
                thatRocket.break = false;

                thatRocket.accel(this.speed);
            }

            if (event.code === 'KeyA') {
                event.preventDefault(); thatRocket.throttle = true;
                thatRocket.break = false;
                thatRocket.accel(-this.speed);
            }

            if (event.code === 'KeyS') {
                event.preventDefault(); thatRocket.throttle = false;
                thatRocket.break = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            event.preventDefault(); thatRocket.throttle = false;
            thatRocket.break = false;
        });
    }
}