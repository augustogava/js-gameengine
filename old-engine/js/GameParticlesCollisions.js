
class GameParticlesCollisions {

    constructor() {

    }

    init() {
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
                }

                return;
            }

            this.addShape(this.transformCodeToShapeType(event.code));
        });
    }

}