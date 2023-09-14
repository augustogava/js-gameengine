class FlatAABB {
  constructor(min, max) {
      this.min = min;
      this.max = max;
  }

  // Alternative constructor using individual coordinates
  static fromCoordinates(minX, minY, maxX, maxY) {
      return new FlatAABB(new FlatVector(minX, minY), new FlatVector(maxX, maxY));
  }
}

class FlatVector {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

// Usage
const aabb1 = new FlatAABB(new FlatVector(0, 0), new FlatVector(1, 1));
const aabb2 = FlatAABB.fromCoordinates(0, 0, 1, 1);


class Collisions {
  constructor() {

  }

  static resolveCollisionWithPolygon(obj, otherPolygon) {
    let smallestOverlap = Infinity;
    let smallestAxis = null;
    let collisionPoint = null;

    let allEdges = obj.polygon.edges.concat(otherPolygon.edges);

    for (let edge of allEdges) {
      let axis = new Vector(edge.p1.position.getY() - edge.p0.position.getY(), edge.p0.position.getX() - edge.p1.position.getX()).normalize();

      let [minA, maxA] = obj.projectOntoAxis(axis);
      let [minB, maxB] = otherPolygon.shape.projectOntoAxis(axis);

      let overlap = obj.getOverlap(minA, maxA, minB, maxB);

      if (overlap === null) {
        return; // No collision
      } else if (overlap < smallestOverlap) {
        smallestOverlap = overlap;
        smallestAxis = axis;
      }
    }

    if (smallestAxis) {
      let centerPolygon = obj.getCenter(); // Assuming you have a method to get the center of the polygon
      let directionToOther = otherPolygon.shape.getCenter().subtract(centerPolygon).normalize();

      // Ensure the impulse is in the correct direction
      if (smallestAxis.dot(directionToOther) < 0) {
        smallestAxis = smallestAxis.multiply(-1); // Reverse the direction of the impulse
      }

      // Calculate the impulse based on overlap and some constant factor
      let impulse = smallestAxis.multiply(smallestOverlap * 2);
      impulse.multiplyBy(.1);
      // Adjust velocities based on impulse
      let polygonMass = obj.polygon.mass || 1;
      let otherMass = otherPolygon.mass || 1;
      let totalMass = polygonMass + otherMass;

      let collisionPoint = obj.getCenter().add(otherPolygon.shape.getCenter()).multiplyBy(0.5);

      let r = obj.getCenter().subtract(collisionPoint);
      // obj.torque = r.cross(impulse);
      obj.polygon.velocity.subtractFrom(impulse.multiply(otherMass / totalMass));
      otherPolygon.velocity.addTo(impulse.multiply(polygonMass / totalMass));
    }

    //chat
    // if (smallestAxis) {
    // 	let impulse = smallestAxis.multiply(smallestOverlap);
    // 	let polygonMassA = obj.polygon.mass || 1;
    // 	let polygonMassB = otherPolygon.mass || 1;
    // 	let totalMass = polygonMassA + polygonMassB;

    // 	obj.polygon.velocity.subtractFrom(impulse.multiply(polygonMassB / totalMass));
    // 	otherPolygon.velocity.addTo(impulse.multiply(polygonMassA / totalMass));

    // 	// Calculate the collision point
    // 	collisionPoint = obj.getCenter().add(otherPolygon.shape.getCenter()).multiplyBy(0.5);

    // 	// Calculate the torque for both polygons
    // 	let rA = obj.getCenter().subtract(collisionPoint);
    // 	let rB = otherPolygon.shape.getCenter().subtract(collisionPoint);

    // 	let torqueA = rA.cross(impulse);
    // 	let torqueB = rB.cross(impulse);

    // 	obj.angularVelocity += torqueA / obj.momentOfInertia;
    // 	otherPolygon.shape.angularVelocity += torqueB / otherPolygon.shape.momentOfInertia;

    // 	// Apply angular damping (if needed)
    // 	obj.angularVelocity *= obj.angularDamping;
    // 	otherPolygon.shape.angularVelocity *= otherPolygon.shape.angularDamping;
    // }
  }

  static resolveCollisionWithCircle(obj, circle) {
    let smallestOverlap = Infinity;
    let smallestAxis = null;
    let collisionPoint = null;

    // Check for circle's position inside the polygon
    if (obj.containsPoint(circle.position)) {
      for (let edge of obj.polygon.edges) {
        let axis = new Vector(edge.p1.position.getY() - edge.p0.position.getY(), edge.p0.position.getX() - edge.p1.position.getX()).normalize();
        let overlap = circle.radius - circle.distanceToLineSegment(edge.p0.position, edge.p1.position);
        if (overlap < smallestOverlap) {
          smallestOverlap = overlap;
          smallestAxis = axis;
        }
      }
    }

    // Check for this polygon's vertex inside the circle
    for (let vertex of obj.polygon.vertices) {
      if (circle.containsPoint(vertex.position)) {
        let axis = vertex.position.subtract(circle.position).normalize();
        let overlap = circle.radius - vertex.position.distance(circle.position);
        if (overlap < smallestOverlap) {
          smallestOverlap = overlap;
          smallestAxis = axis;
        }
      }
    }

    // Check for circle close to this polygon's edge
    for (let edge of obj.polygon.edges) {
      let distance = circle.distanceToLineSegment(edge.p0.position, edge.p1.position);
      if (distance < circle.radius) {
        let axis = edge.p0.position.add(edge.p1.position).multiplyBy(0.5).subtractFrom(circle.position).normalize();
        let overlap = circle.radius - distance;
        if (overlap < smallestOverlap) {
          smallestOverlap = overlap;
          smallestAxis = axis;
        }
      }
    }


    if (smallestAxis) {
      // Calculate the direction from the polygon's center to the circle's center
      let centerPolygon = obj.getCenter(); // Assuming you have a method to get the center of the polygon
      let directionToCircle = circle.position.subtract(centerPolygon).normalize();

      // Ensure the impulse is in the correct direction
      if (smallestAxis.dot(directionToCircle) < 0) {
        smallestAxis = smallestAxis.multiply(-1); // Reverse the direction of the impulse
      }

      // // Calculate the impulse based on overlap and some constant factor
      // let impulse = smallestAxis.multiply(smallestOverlap * 2);

      // // Adjust velocities based on impulse
      // let polygonMass = obj.polygon.mass || 1;
      // let circleMass = circle.mass || 1;
      // let totalMass = polygonMass + circleMass;

      // let collisionPoint = circle.position.subtract(smallestAxis.multiply(circle.radius - smallestOverlap * 0.5));
      // let r = obj.getCenter().subtract(collisionPoint);
      // let torque = r.cross(impulse); // Assuming you have a cross product method in your Vector class
      // obj.angularVelocity = torque * 0.001; // Adjust the multiplier as needed

      // obj.polygon.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
      // circle.velocity.addTo(impulse.multiply(polygonMass / totalMass));


      // Calculate the impulse based on overlap and some constant factor
      let impulse = smallestAxis.multiply(smallestOverlap * 2);

      // Adjust velocities based on impulse
      let polygonMass = obj.mass || 1;
      let circleMass = circle.mass || 1;
      let totalMass = polygonMass + circleMass;

      obj.velocity.subtractFrom(impulse.multiply(circleMass / totalMass));
      circle.velocity.addTo(impulse.multiply(polygonMass / totalMass));

      // Calculate Torque due to the collision
      collisionPoint = circle.position.subtract(smallestAxis.multiply(circle.radius - smallestOverlap * 0.5));
      let r = obj.getCenter().subtract(collisionPoint);
      obj.torque = r.cross(impulse);

      obj.torque = obj.torque * .1;
    }
  }
}