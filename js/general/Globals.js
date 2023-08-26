class Globals {
  boundaries = true;
  attractionObjects = false;
  verifyCollisions = true;
  debugState = true;

  static getBoundaries() {
    return this.boundaries;
  }

  static setBoundaries(v) {
    if (!v)
      return;

    this.boundaries = v;
  }

  static isCollisions() {
    return this.verifyCollisions;
  }

  static setCollisions(v) {
    if (!v)
      return;

    this.verifyCollisions = v;

  }

  static isAttraction() {
    return this.attractionObjects;
  }

  static isDebug() {
    return this.debugState;
  }

  static setDebug(v) {
    if (!v)
      return;

    this.debugState = v;
  }



}