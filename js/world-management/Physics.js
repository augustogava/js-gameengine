//Ajustar para o mouse está a direção
class Physics {
    constructor(obj) {
        this.gravity = new Vector(0, 0.55);

        this.linearDamping = 0.8;
        this.angularDamping = 0.95;

        this.bounce = 1;

        this.obj = obj;
    }

    update() {
        this.obj.velocity.multiplyBy(this.angularDamping);
        this.obj.velocity.addTo(this.gravity);
    }
}