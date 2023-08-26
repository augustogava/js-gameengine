class Camera {
  constructor(rocket, cx = 0, cy = 0) {
    this.rocket = rocket;
    
    this.position = new Vector(cx, cy);
    this.x = cx;
    this.y = cy;
    this.scale = 1;
    this.active = false;
  }

  update() {

  }

  updateCameraPlayer(player) {
    if (player.camerabox) {
      let speed = player.getSpeed();

      const maxWidthX = background.width - canvas.width;
      //right
      if (player.camerabox.position.getX() + player.camerabox.width / 2 > canvas.width) {
        speed = -speed;

        if (Math.abs(background.position.x) > maxWidthX + speed) {
          speed = 0;
          this.position = new Vector(0, 0);
          background.position.x = -maxWidthX;

          return;
        }

        this.move(speed, 0);
      } else
        if (player.camerabox.position.getX() - player.camerabox.width / 2 < 0) {

          if (background.position.x + speed > 0) {
            speed = 0;
            this.position = new Vector(0, 0);
            background.position.x = 0;

            return;
          }

          this.move(speed, 0);
        }else{
          speed = 0;
          this.position.multiplyBy(.94);
        }
    }
  }

  set() {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
  }

  getScreenPos(mx, my) {
    return {
      x: (mx - this.x) / this.scale,
      y: (my - this.y) / this.scale
    };
  }

  move(dx, dy) {
    this.position.addTo( new Vector(dx, dy) );
    // this.y += dy;
  }

  zoom(val) {
    let factor = 0.8;
    if (val > 0) {
      factor = 1 / factor;
    } else {
      // if (this.scale === this.minZoom) return;
    }

    this.scale *= factor;

    const dx = (/* Assuming a mouse equivalent in JavaScript */ mouseX - this.x) * (factor - 1);
    const dy = (/* Assuming a mouse equivalent in JavaScript */ mouseY - this.y) * (factor - 1);

    this.x -= dx;
    this.y -= dy;
  }
}