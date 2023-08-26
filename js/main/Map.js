class Boundary {
  constructor(pos, w, h) {
    this.pos = pos;
    this.width = w;
    this.height = h;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.pos.getX(), this.pos.getX(), this.w, this.h);
  }
}

const background = new Sprite(
  {
    position: new Vector(0, 0),
    velocity: null,
    image: new ImageHelper('../images/background_p1.png')
  }
);

class Map {
  constructor(rocket) {
    this.rocket = rocket;
    this.load = false;
  }

  draw() {
    let camera = this.rocket.camera;
    background.position.x += camera.position.getX();

    background.draw();
  }
}