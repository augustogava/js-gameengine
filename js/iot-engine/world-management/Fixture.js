 class Fixture {
    constructor(obj = null, friction = 1){
        this.h = 1;
        this.obj = obj;

        this.friction = friction;
        this.density = 1;
        this.restitution = 1;
        this.bounce = 1;
    }

    static createFixture() {
        return new Fixture();
    }

    collidesWith(fixture) {
        return this.obj.intersects(fixture.obj);
    }

    solveCollision(fixture) {
        return this.obj.resolveCollision(fixture.obj);
    }
}