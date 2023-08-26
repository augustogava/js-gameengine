
class GameParticlesCollisions {

    constructor() {

    }

    init() {
        // game.objs
    }

    update() {

    }

    draw() {

    }

    resize() {

    }

    userInteractions() {
        var that = this;
        window.addEventListener("blur", function () {
            // that.pauseGameLoopState();
        });

        window.addEventListener("focus", function () {
            // that.resumeGameLoopState();
        });

        canvas.addEventListener("click", event => {
            this.addShape( "CIRCLE");
            // this.addShape(this.lastShapeUsed);
            this.lastShapeUsed = this.lastShapeUsed == "CIRCLE" ? "SQUARE" : "CIRCLE";
        });

        document.addEventListener('mousemove', function (mouseMoveEvent) {
            that.mousePosition.x = mouseMoveEvent.pageX;
            that.mousePosition.y = mouseMoveEvent.pageY;

            that.updateFollowObject();
        }, false);


        document.addEventListener('keydown', (event) => {
            if (event.code != 'KeyB' && event.code != 'KeyR' && event.code != 'KeyF' && event.code != 'KeyP'  && event.code != 'KeyN') {
                return;
            }

            if (event.code === 'KeyP') {
                that.invertGameLoopState();
            }

            if (event.code === 'KeyN') {
                this.addParticles();
            }
            

            if (event.code === 'KeyF') {
                this.followShape = !this.followShape;

                if (that.fallowShapeIndex) {
                    this.objs[that.fallowShapeIndex].changePhysicsState(false);
                    that.fallowShapeIndex = undefined;
                } else if (!that.fallowShapeIndex) {
                    this.fallowShapeIndex = Utils.randomIntFromInterval(0, that.objs.length - 1);
                    this.objs[that.fallowShapeIndex].changePhysicsState(true);

                    this.updateFollowObject();
                }

                return;
            }

            this.addShape(this.transformCodeToShapeType(event.code));
        });
    }



}







// class MainGame {
//     frameCount = 0;
//     fps = 200;
//     startTime;
//     followShape = false;
//     fallowShapeIndex = undefined;
//     animationRunning = true;
//     lastShapeUsed = "CIRCLE";
//     mousePosition = new Vector(0, 0);
//     resetTime = false;
//     scalar = 2 * Utils.randomBoolean1orMinus1();

//     physicsFriction = 0.99;

//     constructor(gameObjectType) {
//         Globals.setBoundaries(true);
//         Globals.setCollisions(true);
//         Globals.setDebug(false);
//         // Globals.setCollisions(true);

//         // canvas = document.getElementById("gameCanvas");
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         canvas.centerX = canvas.width / 2;
//         canvas.centerY = canvas.height / 2;
//         this.objs = [];
//         this.prevTime = 0;

//         this.debugger = new Debugger();

//         this.gameObjectType = gameObjectType;
//     }

//     init() {
//         this.starLoop();
//         this.userInteractions();

//         this.collisionGrid = new CollisionGrid(canvas.width, canvas.height, 2);
//     }

//     starLoop() {
//         requestAnimationFrame(this.gameLoop.bind(this));
//     }

//     gameLoop(time) {
//         this.calculateFPS();

//         if ( this.resetTime ) {
//             this.prevTime = time; this.resetTime = false;
//         }

//         let deltaTime = (time - this.prevTime) * 10;
//         this.prevTime = time;

//         this.update(deltaTime);
//         this.draw();

//         this.debugger.update();

//         if (this.animationRunning)
//             requestAnimationFrame(this.gameLoop.bind(this));
//     }

//     update(deltaTime) {
//         for (const obj of this.objs) {
//             obj.update(deltaTime);
//         }

//         this.gameObjectType.update();
//         this.collisionInit();
//     }

//     collisionInit() {
//         if (Globals.isCollisions()) {
//             for (let i = 0; i < this.objs.length; i++) {
//                 for (let j = i + 1; j < this.objs.length; j++) {
//                     this.objs[i].collidesWith(this.objs[j]);
//                 }
//             }
//         }
//     }

//     draw() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         this.addText(`${this.fps}`, 10, 20, 15, "white");

//         for (const obj of this.objs) {
//             obj.draw(ctx);

//             if (Globals.isDebug()) {
//                 obj.debug();
//             }
//         }

//         this.gameObjectType.draw();

//         // this.debug()
//     }

//     addText(t, x, y, size, color) {
//         ctx.fillStyle = color;
//         ctx.font = `bold ${size}px normal`;
//         ctx.fillText(t, x, y);
//     }

//     userInteractions() {
//         var that = this;
//         window.addEventListener("blur", function () {
//             // that.pauseGameLoopState();
//         });

//         window.addEventListener("focus", function () {
//             // that.resumeGameLoopState();
//         });

//         canvas.addEventListener("click", event => {
//             this.addShape( "CIRCLE");
//             // this.addShape(this.lastShapeUsed);
//             this.lastShapeUsed = this.lastShapeUsed == "CIRCLE" ? "SQUARE" : "CIRCLE";
//         });

//         document.addEventListener('mousemove', function (mouseMoveEvent) {
//             that.mousePosition.x = mouseMoveEvent.pageX;
//             that.mousePosition.y = mouseMoveEvent.pageY;

//             that.updateFollowObject();
//         }, false);


//         document.addEventListener('keydown', (event) => {
//             if (event.code != 'KeyB' && event.code != 'KeyR' && event.code != 'KeyF' && event.code != 'KeyP'  && event.code != 'KeyN') {
//                 return;
//             }

//             if (event.code === 'KeyP') {
//                 that.invertGameLoopState();
//             }

//             if (event.code === 'KeyN') {
//                 this.addParticles();
//             }
            

//             if (event.code === 'KeyF') {
//                 this.followShape = !this.followShape;

//                 if (that.fallowShapeIndex) {
//                     this.objs[that.fallowShapeIndex].changePhysicsState(false);
//                     that.fallowShapeIndex = undefined;
//                 } else if (!that.fallowShapeIndex) {
//                     this.fallowShapeIndex = Utils.randomIntFromInterval(0, that.objs.length - 1);
//                     this.objs[that.fallowShapeIndex].changePhysicsState(true);

//                     this.updateFollowObject();
//                 }

//                 return;
//             }

//             this.addShape(this.transformCodeToShapeType(event.code));
//         });

//         this.gameObjectType.userInteractions();

//     }

//     resumeGameLoopState() {
//         if(this.animationRunning){
//             return;
//         }

//         console.log("resumeGameLoopState");

//         this.resetTime = true;
//         this.animationRunning = true;
//         this.starLoop();
//     }

//     pauseGameLoopState() {
//         if(!this.animationRunning){
//             return;
//         }

//         console.log("pauseGameLoopState");
        
//         this.animationRunning = false;
//     }

//     invertGameLoopState() {
//         if (!this.animationRunning) {
//             this.resetTime = true;
//         }
//         this.animationRunning = !this.animationRunning;
//         this.starLoop();
//     }

//     updateFollowObject() {
//         if (this.followShape && this.objs && this.objs.length > 0 && this.fallowShapeIndex >= 0) {
//             let retObj = this.objs[this.fallowShapeIndex];
//             retObj.update(1);
//             retObj.updatePosition(new Vector(this.mousePosition.x, this.mousePosition.y));
//         }
//     }

//     transformCodeToShapeType(code) {
//         if (code === undefined || code === 'KeyB')
//             return "CIRCLE";

//         if (code === 'KeyR')
//             return "SQUARE";
//     }

//     addObject(obj) {
//         this.objs.push(obj);
//     }

//     addParticles(){
//         // this.addShape( "CIRCLE");
//         var self = this;
//         setInterval(function() { self.addFlow(); }, 1)
//     }

//     addFlow(){
//         const x = -10;
//         const y = 150 + Utils.randomIntFromInterval(-2, 2);
//         const size = Utils.randomIntFromInterval(4, 7);
//         const mass = Utils.randomIntFromInterval(1, 1) * size/1000;

//         this.addObject(new Circle(new Vector(x, y), mass, size, 0, 20+Utils.randomIntFromInterval(-2, 2), 5.9 +  Utils.randomIntFromInterval(0, 2) / 10 ));
//     }
    
//     addShape(shapeType) {
//         const rect = canvas.getBoundingClientRect();
//         const midpoint = canvas.height / 2;

//         const x = this.mousePosition.x;
//         const y = this.mousePosition.y;

//         const normalizedX = x / midpoint;
//         const size = Utils.randomIntFromInterval(15, 40);
//         const mass = Utils.randomIntFromInterval(10, 10) * size/100;

//         if (shapeType == "CIRCLE") {
//             this.lastShapeUsed = "CIRCLE";

//             this.addObject(new Circle(new Vector(x, y), mass, size, 0, 5, Math.random() * Math.PI * 2));
//         } if (shapeType == "SQUARE") {
//             this.lastShapeUsed = "SQUARE";

//             this.addObject(new Rectangle(new Vector(x, y), new Vector(this.scalar * normalizedX, 0), 1, 150, 25));
//         } if (shapeType == "STICK") {
//             this.lastShapeUsed = "STICK";

//             this.addObject(new Sticks(new Vector(x, y), new Vector(0, 0), 1, 150, 50));
//         }
//     }

//     getObjects() {
//         return this.objs;
//     }

//     calculateFPS() {
//         this.frameCount++;
//         const currentTime = performance.now();
//         if (this.startTime === undefined) this.startTime = currentTime;
//         if (currentTime - this.startTime >= 1000) {
//             this.fps = this.frameCount;
//             this.frameCount = 0;
//             this.startTime = currentTime;
//         }
//     }

//     debug() {
//         // if (Globals.isDebug()) {
//         //     this.debugger.draw();
//         // }

//     }
// }