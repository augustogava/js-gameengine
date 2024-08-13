class RocketFakeGameImp extends Scene {
    constructor() {
        super(RocketFakeGameImp);
        Globals.setInputInteractions(true);
        this.selectedBody = null;

        this.createWorld('main');
        this.createMap();
        this.createCamera();
        this.createUserInteractions();

        this.addObjects();
    }

    init() {
        // Initialization code here, if needed
    }

    addObjects() {
        for (let i = 0; i < 1; i++) {
            let x0 = Utils.randomInt(100, canvas.clientWidth - 100);
            let y0 = Utils.randomInt(100, canvas.clientHeight - 100);
            let x1 = x0 + Utils.randomInt(-0, 50);
            let y1 = y0 + Utils.randomInt(-0, 50);
            let w = Utils.randomInt(100, 130);
            let m = Utils.randomInt(1, 30);

            var obj = new Ball(this, 1, 50, new Vector(200 + (i * 200), 200 + (i * 200)));

            var fixPol2 = new Fixture(obj, 1);
            obj.addFixture(fixPol2);

            this.addWorldObj('main', obj);
        }

        this.addWalls();
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
            // Ensure mousePos is a Vector
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
