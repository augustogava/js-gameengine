class Collisions {
  constructor() {

  }

  resolveCollision(ball, rect) {
    let overlap = Infinity;
    let axis = null;
    let smallest = null;

    // Get the axes of the ball and rect
    let axes = [new Vector(rect.points[1].x - rect.points[0].x, rect.points[1].y - rect.points[0].y),
    new Vector(rect.points[1].x - rect.points[2].x, rect.points[1].y - rect.points[2].y),
    new Vector(ball.center.x - ball.prev.x, ball.center.y - ball.prev.y),
    ];

    // Project the ball and rect onto each axis
    for (let i = 0; i < axes.length; i++) {
      let proj1 = projectShapeOntoAxis(ball, axes[i]);
      let proj2 = projectShapeOntoAxis(rect, axes[i]);

      // Check if there is no overlap
      if (!checkOverlap(proj1, proj2)) {
        return false;
      }

      // Get the minimum overlap
      let o = getOverlap(proj1, proj2);
      if (o < overlap) {
        overlap = o;
        axis = axes[i];
        smallest = proj1[0] < proj2[0] ? proj1 : proj2;
      }
    }

    // Resolve the collision
    let correction = new Vector(axis.x * overlap, axis.y * overlap);
    let signedDist = smallest[0] + correction.x;
    let sign = Math.sign(signedDist);
    correction.x = sign < 0 ? correction.x : -correction.x;
    correction.y = sign < 0 ? correction.y : -correction.y;

    ball.center.x += correction.x / 2;
    ball.center.y += correction.y / 2;
    rect.x += correction.x / 2;
    rect.y += correction.y / 2;
  }

  checkOverlap(proj1, proj2) {
    let [min1, max1] = proj1;
    let [min2, max2] = proj2;

    return min1 <= max2 && min2 <= max1;
  }

  getOverlap(proj1, proj2) {
    let [min1, max1] = proj1;
    let [min2, max2] = proj2;

    return Math.min(max1, max2) - Math.max(min1, min2);
  }

  projectShapeOntoAxis(shape, axis) {
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < shape.vertices.length; i++) {
        let dotProduct = shape.vertices[i].dotProduct(axis);
        min = Math.min(min, dotProduct);
        max = Math.max(max, dotProduct);
    }
    return {min, max};
}


  // Backup collision Sware
  // checkCollision(otherObj) {
  //     const closestX = Utils.clamp(this.position.x, otherObj.position.x - otherObj.sideLength / 2, otherObj.position.x + otherObj.sideLength / 2);
  //     const closestY = Utils.clamp(this.position.y, otherObj.position.y - otherObj.sideLength / 2, otherObj.position.y + otherObj.sideLength / 2);
  //     const distance = Math.sqrt(
  //         (closestX - this.position.x) * (closestX - this.position.x) + (closestY - this.position.y) * (closestY - this.position.y)
  //     );
  //     const minimumDistance = this.sideLength / 2;

  //     // return distance < this.radius;

  //     if (distance <= minimumDistance) {
  //         this.resolveCollision(otherObj);
  //     }
  // }



}