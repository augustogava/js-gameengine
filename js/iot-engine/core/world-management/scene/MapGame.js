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

class MapGame {
  constructor(rocket) {
    this.rocket = rocket;
    this.load = false;
    this.gridEnabled = Globals.isGridVisible();
    this.grid = new Grid(canvas.width, canvas.height, Globals.getGridSize());
  }

  toggleGrid() {
    this.gridEnabled = !this.gridEnabled;
    this.grid.toggleVisibility();
  }

  update(deltaTime) {
  }

  draw() {
    let camera = this.rocket.camera;
    background.position.x += camera.position.getX();

    background.draw();

    if (this.gridEnabled) {
      this.grid.draw(ctx);
    }
  }
}