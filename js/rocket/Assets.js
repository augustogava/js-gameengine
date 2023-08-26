class Assests {
  constructor() {
    this.assets = [];
  }

  set() {
    if (this.active) {
      this.active = false;
      // Assuming you have a graphics equivalent in JavaScript
      // g.pop(); // Commented as we don't have a direct equivalent
    } else {
      // g.push("transform"); // Commented as we don't have a direct equivalent
      // g.translate(this.x, this.y); // Commented as we don't have a direct equivalent
      // g.scale(this.scale); // Commented as we don't have a direct equivalent
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
    this.x += dx;
    this.y += dy;
  }

  zoom(val) {
    let factor = 0.8;
    if (val > 0) {
      factor = 1 / factor;
      // Commented as the conditions are not necessary in the current context
      // if (this.scale === this.maxZoom) return;
    } else {
      // if (this.scale === this.minZoom) return;
    }

    // Commented as we don't have a 'clamp' function in the given Lua code and no maxZoom or minZoom values
    // this.scale = clamp(round(this.scale * factor, 0.001), this.minZoom, this.maxZoom);
    this.scale *= factor;

    const dx = (/* Assuming a mouse equivalent in JavaScript */ mouseX - this.x) * (factor - 1);
    const dy = (/* Assuming a mouse equivalent in JavaScript */ mouseY - this.y) * (factor - 1);

    this.x -= dx;
    this.y -= dy;
  }
}