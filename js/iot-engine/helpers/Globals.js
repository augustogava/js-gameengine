class Globals {
  static boundaries = true;
  static attractionObjects = false;
  static verifyCollisions = true;
  static debugState = true;
  static inputInteractions = false;
  static gridSize = 50;
  static gridVisible = true;

  static getBoundaries() {
    return this.boundaries;
  }

  static setBoundaries(v) {
    if (!v) return;
    this.boundaries = v;
  }

  static isCollisions() {
    return this.verifyCollisions;
  }

  static setCollisions(v) {
    if (!v) return;
    this.verifyCollisions = v;
  }

  static isAttraction() {
    return this.attractionObjects;
  }

  static isDebug() {
    return this.debugState;
  }

  static setDebug(v) {
    this.debugState = v;
  }

  static isInputInteractions() {
    return this.inputInteractions;
  }

  static setInputInteractions(v) {
    this.inputInteractions = v;
  }

  static getGridSize() {
    return this.gridSize;
  }

  static setGridSize(size) {
    this.gridSize = size;
  }

  static isGridVisible() {
    return this.gridVisible;
  }

  static setGridVisible(v) {
    this.gridVisible = v;
  }
}