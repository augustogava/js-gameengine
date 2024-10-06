class GameSimpleBalls extends Scene {
    constructor() {
        Globals.setBoundaries(true);
        Globals.setCollisions(true);
        Globals.setDebug(false);
        Globals.setGridSize(5);
        Globals.setGridVisible(true);

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
        let sandParticle = new Sand(this, 0, 0, 1, this.map.grid.getCellSize().x );
        var fixture = new Fixture(sandParticle, 1);
        sandParticle.addFixture(fixture);

        this.addWorldObj('main', sandParticle);
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

            if (event.code === 'KeyG') {
                if (thatRocket.map) {
                    thatRocket.map.toggleGrid();
                }
            }
        });
    }
}
