class Camera {
  constructor(rocket, cx = 0, cy = 0) {
    this.rocket = rocket;

    this.position = new Vector(cx, cy);
    this.x = cx;
    this.y = cy;
    this.scale = 1;
    this.active = false;
  }

  static createCameraBox(v) {
    return v;
  }

  update() {

  }

  updateCameraPlayer(object) {
    if (object.camerabox) {
        // Calculate the speed of movement based on the object's speed.
        let cameraMoveSpeed = object.getSpeed2() * 0.035; // Adjusted multiplier

        // The maximum X position that the background can move to.
        const maxCameraX = background.width - canvas.width;

        // Calculate the right and left edges of the object's camera box.
        const rightEdge = object.camerabox.position.getX() + object.camerabox.width / 2;
        const leftEdge = object.camerabox.position.getX() - object.camerabox.width / 2;

        if (rightEdge > canvas.width) { // If object is moving to the right edge
            if (Math.abs(background.position.x) > maxCameraX - cameraMoveSpeed) {
                cameraMoveSpeed = maxCameraX + background.position.x; // Move only the remaining distance.
            }
            this.move(-cameraMoveSpeed, 0); // Move camera to the left.
        } else if (leftEdge < 0) { // If object is moving to the left edge
            if (background.position.x + cameraMoveSpeed > 0) {
                cameraMoveSpeed = -background.position.x; // Move only the remaining distance.
            }
            this.move(cameraMoveSpeed, 0); // Move camera to the right.
        } else {
            // If object is not near any edge, dampen the camera's movement.
            this.position.multiplyBy(0.9);
        }

        // Immediately clamp the background position after move to ensure it doesn't exceed its boundaries.
        background.position.x = Math.min(0, Math.max(-maxCameraX, background.position.x));
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
    this.position.addTo(new Vector(dx, dy));
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