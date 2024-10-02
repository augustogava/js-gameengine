class GameSimpleBalls extends Scene {
    constructor() {
        super(GameSimpleBalls);
        this.selectedBody = null;

        this.createWorld('main');
        this.createMap();
        this.createCamera();
        this.createUserInteractions();

    }

    init() {
        this.addObjects();
    }

    addObjects() {
        for (let i = 0; i < 100; i++) {
            let x0 = Utils.randomInt(25, canvas.clientWidth - 50);
            let y0 = Utils.randomInt(15, 250);
            let x1 = x0 + Utils.randomInt(-0, 50);
            let y1 = y0 + Utils.randomInt(-0, 50);
            let w = Utils.randomInt(1, 15);
            let m = w/100 + Utils.randomInt(1, 5);

            var ball = new Ball(this, m, w, new Vector(x0, y0));

            var fixPol2 = new Fixture(ball, 1);
            ball.addFixture(fixPol2);

            this.addWorldObj('main', ball);
        }

        this.addWalls();

        let ground = new Ground(this, 0, new Vector(200, canvas.clientHeight/3), new Vector(canvas.clientWidth-200, canvas.clientHeight-300));
        var fixGround = new Fixture(ground, 1);
        ground.addFixture(fixGround);

        this.addWorldObj('main', ground);
    }

    addWalls() {
        let edge1 = new Wall(this, 0, 0, canvas.clientWidth, 0);
        let edge2 = new Wall(this, canvas.clientWidth, 0, canvas.clientWidth, canvas.clientHeight);
        let edge3 = new Wall(this, canvas.clientWidth, canvas.clientHeight, 0, canvas.clientHeight);
        let edge4 = new Wall(this, 0, canvas.clientHeight, 0, 0);

        this.addWorldObj('main', edge1);
        this.addWorldObj('main', edge2);
        this.addWorldObj('main', edge3);
        this.addWorldObj('main', edge4);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    selectObjectFromMousePos(mousePos) {
        let inside = false;
        if (!(mousePos instanceof Vector)) {
            console.error("mousePos is not a valid Vector.");
            return;
        }
    
        for (let obj of this.getWorldObjs('main')) {
            if (Utils.existsMethod(obj.containsPoint) && obj.containsPoint(mousePos)) {
                this.selectedBody = obj;
                inside = true;
                if (Globals.isInputInteractions()) {
                    this.showInputs(obj);
                }
                break;
            }
        }
    
        if (!inside) {
            this.selectedBody = null;
        }
    }

    showInputs(obj) {
        if (obj && Utils.existsMethod(obj.getInputFieldsConfig)) {
            this.inputUserInteractions.bindDynamicObject(obj, 'Circle');
        }
    }

    draw() {
        super.draw();
    }

    resize() {
        game.setScreen();
    }

    userInteractions() {
        const thatRocket = this;
    
        document.addEventListener('mousedown', function (e) {
            eventshelper.mousePos = new Vector(e.clientX, e.clientY);
            thatRocket.selectObjectFromMousePos(eventshelper.mousePos);
        }, false);
    
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyK') {
                Globals.setDebug(!Globals.isDebug());
            }
        });
    }
}
