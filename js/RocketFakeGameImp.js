
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}
class RocketFakeGameImp extends Scene {
    constructor() {
        super(RocketFakeGameImp);
        Globals.setInputInteractions(true);
        this.players = [];
        this.npc = [];
    
        this.selectedBody = null;

        this.createWorld('main');
        this.createMap();
        this.createCamera();
        this.createUserInteractions();



        var ball1 = new Ball(this, new Vector(400, 500), 22);
        ball1.addCamera();

        var fix = new Fixture(ball1);
        ball1.addFixture(fix);

        var ball2 = new Ball(this, new Vector(600, 500), 5);
        var fixBall2 = new Fixture(ball2);
        ball2.addFixture(fixBall2);

        var box = new Box(this, new Vector(0, 0));
        var fixPol = new Fixture(box, 1);
        box.addFixture(fixPol);

        var box2 = new Box(this, new Vector(320, 220));
        var fixPol2 = new Fixture(box2, 1);
        box2.addFixture(fixPol2);

        

        this.addWorldObj('main', ball1);
        this.addWorldObj('main', ball2);

        // this.addWorldObj('main', box);
        // this.addWorldObj('main', box2);
        // var b = new Box();
        // b.draw();
        // this.addWorldObj('effects', ef);
    }

    init() {

    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    selectObjectFromMousePos() {
        var inside = false;
        for (let obj of this.getWorldObjs('main')) {
            if (obj.containsPoint(eventshelper.mousepos)) {
                this.selectedBody = obj;
                inside = true;
                if (Globals.isInputInteractions()) {
                    this.showInputs(obj);
                }
                break;
            }
        }

        if (!inside) {
            this.selectedBody = false;

            return;
        }
    }

    showInputs(obj) {
        if (!obj) {
            return;
        }

        if (Utils.existsMethod(obj.getInputFieldsConfig)) {
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
        var thatRocket = this;

        document.addEventListener('mousedown', function (e) {
            thatRocket.selectObjectFromMousePos();
        }, false);


        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyK') {
                Globals.setDebug(!Globals.isDebug());
            }
        });
    }
}