class CollData {
    constructor(o1, o2, normal, pen, cp) {
        this.o1 = o1;
        this.o2 = o2;
        this.normal = normal;
        this.pen = pen;
        this.cp = cp;
    }

    penRes() {
        let penResolution = this.normal.multiply(this.pen / (this.o1.invMass + this.o2.invMass));
        this.o1.shape.position = this.o1.shape.position.add(penResolution.mult(this.o1.invMass));
        this.o2.shape.position = this.o2.shape.position.add(penResolution.mult(-this.o2.invMass));
    }

    collRes() {
        //1. Closing velocity
        let collArm1 = this.cp.subtract(this.o1.shape.position);
        let rotVel1 = new Vector(-this.o1.shape.angVel * collArm1.y, this.o1.shape.angVel * collArm1.x);
        let closVel1 = this.o1.shape.velocity.add(rotVel1);

        let collArm2 = this.cp.subtract(this.o2.shape.position);
        let rotVel2 = new Vector(-this.o2.shape.angVel * collArm2.y, this.o2.shape.angVel * collArm2.x);
        let closVel2 = this.o2.shape.velocity.add(rotVel2);

        //2. Impulse augmentation
        let impAug1 = Utils.cross(collArm1, this.normal);
        impAug1 = impAug1 * this.o1.inv_inertia * impAug1;

        let impAug2 = Utils.cross(collArm2, this.normal);
        impAug2 = impAug2 * this.o2.inv_inertia * impAug2;

        let relVel = closVel1.subtract(closVel2);
        let sepVel = Utils.dot(relVel, this.normal);
        let new_sepVel = -sepVel * Math.min(this.o1.elasticity, this.o2.elasticity);
        let vsep_diff = new_sepVel - sepVel;

        let impulse = vsep_diff / (this.o1.inv_m + this.o2.inv_m + impAug1 + impAug2);
        let impulseVec = this.normal.mult(impulse);

        //3. Changing the velocities
        
        
        this.o1.shape.velocity = this.o1.shape.velocity.addTo(impulseVec.mult(this.o1.invMass)).multiply(.1);
        this.o2.shape.velocity = this.o2.shape.velocity.addTo(impulseVec.mult(-this.o2.invMass)).multiply(1);

        // this.o1.shape.acceleration.addTo(impulseVec.multiply(this.o1.invMass));
        // this.o2.shape.acceleration.addTo(impulseVec.multiplyBy(-this.o2.invMass));

        // this.o1.shape.velocity.addTo(impulseVec.multiply(.1));
        // this.o2.shape.velocity.addTo(impulseVec.multiply(.1).multiply(-1));

        
        // this.o1.shape.angVel += this.o1.inv_inertia * Utils.cross(collArm1, impulseVec);
        // this.o2.shape.angVel -= this.o2.inv_inertia * Utils.cross(collArm2, impulseVec);
    }
}

class PhysicsComplex {
    closestPointOnLS(p, w1) {
        let ballToWallStart = w1.start.subtract(p);
        if (Utils.dot(w1.dir, ballToWallStart) > 0) {
            return w1.start;
        }

        let wallEndToBall = p.subtract(w1.end);
        if (Utils.dot(w1.dir, wallEndToBall) > 0) {
            return w1.end;
        }

        let closestDist = Utils.dot(w1.dir, ballToWallStart);
        let closestVect = w1.dir.mult(closestDist)
        return w1.start.subtract(closestVect);
    }

    closestPointsBetweenLS(c1, c2) {
        let shortestDist = this.closestPointOnLS(c1.start, c2).subtract(c1.start).mag();
        let closestPoints = [c1.start, this.closestPointOnLS(c1.start, c2)];
        if (this.closestPointOnLS(c1.end, c2).subtract(c1.end).mag() < shortestDist) {
            shortestDist = this.closestPointOnLS(c1.end, c2).subtract(c1.end).mag();
            closestPoints = [c1.end, this.closestPointOnLS(c1.end, c2)];
        }
        if (this.closestPointOnLS(c2.start, c1).subtract(c2.start).mag() < shortestDist) {
            shortestDist = this.closestPointOnLS(c2.start, c1).subtract(c2.start).mag();
            closestPoints = [this.closestPointOnLS(c2.start, c1), c2.start];
        }
        if (this.closestPointOnLS(c2.end, c1).subtract(c2.end).mag() < shortestDist) {
            shortestDist = this.closestPointOnLS(c2.end, c1).subtract(c2.end).mag();
            closestPoints = [this.closestPointOnLS(c2.end, c1), c2.end];
        }
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(closestPoints[0].x, closestPoints[0].y);
        ctx.lineTo(closestPoints[1].x, closestPoints[1].y);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(closestPoints[0].x, closestPoints[0].y, c1.r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(closestPoints[1].x, closestPoints[1].y, c2.r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        return closestPoints;
    }

    coll_det_bb(b1, b2) {
        if (b1.r + b2.r >= b2.position.subtract(b1.position).mag()) {
            return true;
        } else {
            return false;
        }
    }

    coll_det_bw(b1, w1) {
        let ballToClosest = this.closestPointOnLS(b1.position, w1).subtract(b1.position);
        if (ballToClosest.mag() <= b1.r) {
            return true;
        }
    }

    coll_det_cc(c1, c2) {
        if (c1.r + c2.r >= this.closestPointsBetweenLS(c1, c2)[0].subtract(this.closestPointsBetweenLS(c1, c2)[1]).mag()) {
            return true;
        } else {
            return false;
        }
    }

    pen_res_bb(b1, b2) {
        let dist = b1.position.subtract(b2.position);
        let pen_depth = b1.r + b2.r - dist.mag();
        let pen_res = dist.unit().mult(pen_depth / (b1.inv_m + b2.inv_m));
        b1.position = b1.position.add(pen_res.mult(b1.inv_m));
        b2.position = b2.position.add(pen_res.mult(-b2.inv_m));
    }

    pen_res_bw(b1, w1) {
        let penVect = b1.position.subtract(this.closestPointOnLS(b1.position, w1));
        b1.position = b1.position.add(penVect.unit().mult(b1.r - penVect.mag()));
    }

    pen_res_cc(c1, c2) {
        let dist = this.closestPointsBetweenLS(c1, c2)[0].subtract(this.closestPointsBetweenLS(c1, c2)[1]);
        let pen_depth = c1.r + c2.r - dist.mag();
        let pen_res = dist.unit().mult(pen_depth / (c1.inv_m + c2.inv_m));
        c1.position = c1.position.add(pen_res.mult(c1.inv_m));
        c2.position = c2.position.add(pen_res.mult(-c2.inv_m));
    }

    coll_res_bb(b1, b2) {
        let normal = b1.position.subtract(b2.position).unit();
        let relVel = b1.velocity.subtract(b2.velocity);
        let sepVel = Utils.dot(relVel, normal);
        let new_sepVel = -sepVel * Math.min(b1.elasticity, b2.elasticity);

        let vsep_diff = new_sepVel - sepVel;
        let impulse = vsep_diff / (b1.inv_m + b2.inv_m);
        let impulseVec = normal.mult(impulse);

        b1.velocity = b1.velocity.add(impulseVec.mult(b1.inv_m));
        b2.velocity = b2.velocity.add(impulseVec.mult(-b2.inv_m));
    }

    coll_res_bw(b1, w1) {
        let normal = b1.position.subtract(this.closestPointOnLS(b1.position, w1)).unit();
        let sepVel = Utils.dot(b1.velocity, normal);
        let new_sepVel = -sepVel * b1.elasticity;
        let vsep_diff = sepVel - new_sepVel;
        b1.velocity = b1.velocity.add(normal.mult(-vsep_diff));
    }

    coll_res_cc(c1, c2) {
        let normal = this.closestPointsBetweenLS(c1, c2)[0].subtract(this.closestPointsBetweenLS(c1, c2)[1]).unit();

        //1. Closing velocity
        let collArm1 = this.closestPointsBetweenLS(c1, c2)[0].subtract(c1.position).add(normal.mult(c1.r));
        let rotVel1 = new Vector(-c1.angVel * collArm1.y, c1.angVel * collArm1.x);
        let closVel1 = c1.velocity.add(rotVel1);
        let collArm2 = this.closestPointsBetweenLS(c1, c2)[1].subtract(c2.position).add(normal.mult(-c2.r));
        let rotVel2 = new Vector(-c2.angVel * collArm2.y, c2.angVel * collArm2.x);
        let closVel2 = c2.velocity.add(rotVel2);

        //2. Impulse augmentation
        let impAug1 = Vector.cross(collArm1, normal);
        impAug1 = impAug1 * c1.inv_inertia * impAug1;
        let impAug2 = Vector.cross(collArm2, normal);
        impAug2 = impAug2 * c2.inv_inertia * impAug2;

        let relVel = closVel1.subtract(closVel2);
        let sepVel = Utils.dot(relVel, normal);
        let new_sepVel = -sepVel * Math.min(c1.elasticity, c2.elasticity);
        let vsep_diff = new_sepVel - sepVel;

        let impulse = vsep_diff / (c1.inv_m + c2.inv_m + impAug1 + impAug2);
        let impulseVec = normal.mult(impulse);

        //3. Changing the velocities
        c1.velocity = c1.velocity.add(impulseVec.mult(c1.inv_m));
        c2.velocity = c2.velocity.add(impulseVec.mult(-c2.inv_m));

        c1.angVel += c1.inv_inertia * Vector.cross(collArm1, impulseVec);
        c2.angVel -= c2.inv_inertia * Vector.cross(collArm2, impulseVec);
    }

    //applying the separating axis theorem on two objects
    sat(o1, o2) {
        if (!o1 || !o2) {
            return false;
        }

        let minOverlap = null;
        let smallestAxis;
        let vertexObj;

        let axes = this.findAxes(o1, o2);
        let proj1, proj2 = 0;
        let firstShapeAxes = this.getShapeAxes(o1);

        for (let i = 0; i < axes.length; i++) {
            proj1 = this.projShapeOntoAxis(axes[i], o1);
            proj2 = this.projShapeOntoAxis(axes[i], o2);
            let overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
            if (overlap < 0) {
                return false;
            }

            if ((proj1.max > proj2.max && proj1.min < proj2.min) ||
                (proj1.max < proj2.max && proj1.min > proj2.min)) {
                let mins = Math.abs(proj1.min - proj2.min);
                let maxs = Math.abs(proj1.max - proj2.max);
                if (mins < maxs) {
                    overlap += mins;
                } else {
                    overlap += maxs;
                    axes[i] = axes[i].mult(-1);
                }
            }

            if (overlap < minOverlap || minOverlap === null) {
                minOverlap = overlap;
                smallestAxis = axes[i];
                if (i < firstShapeAxes) {
                    vertexObj = o2;
                    if (proj1.max > proj2.max) {
                        smallestAxis = axes[i].mult(-1);
                    }
                } else {
                    vertexObj = o1;
                    if (proj1.max < proj2.max) {
                        smallestAxis = axes[i].mult(-1);
                    }
                }
            }
        };

        let contactVertex = this.projShapeOntoAxis(smallestAxis, vertexObj).collVertex;
        //smallestAxis.drawVec(contactVertex.x, contactVertex.y, minOverlap, "blue");

        if (vertexObj === o2) {
            smallestAxis = smallestAxis.mult(-1);
        }

        return {
            pen: minOverlap,
            axis: new Vector(smallestAxis.x, smallestAxis.y),
            vertex: new Vector(contactVertex.x, contactVertex.y)
        }
    }

    //returns the min and max projection values of a shape onto an axis
    projShapeOntoAxis(axis, obj) {
        this.setBallVerticesAlongAxis(obj, axis);
        let min = Utils.dot(axis, obj.vertices[0].position);
        let max = min;
        let collVertex = obj.vertices[0].position;
        for (let i = 0; i < obj.vertices.length; i++) {
            let p = Utils.dot(axis, obj.vertices[i].position);
            if (p < min) {
                min = p;
                collVertex = obj.vertices[i].position;
            }
            if (p > max) {
                max = p;
            }
        }
        return {
            min: min,
            max: max,
            collVertex: collVertex
        }
    }

    //finds the projection axes for the two objects
    findAxes(o1, o2) {
        let axes = [];
        if (o1 instanceof Circle && o2 instanceof Circle) {
            axes.push(o2.position.subtract(o1.position).unit());
            return axes;
        }
        if (o1 instanceof Circle) {
            axes.push(this.closestVertexToPoint(o2, o1.position).subtract(o1.position).unit());
            axes.push(o2.dir.normal());
            if (o2 instanceof Rectangle) {
                axes.push(o2.dir);
            }
            return axes;
        }
        if (o2 instanceof Circle) {
            axes.push(o1.dir.normal());
            if (o1 instanceof Rectangle) {
                axes.push(o1.dir);
            }
            axes.push(this.closestVertexToPoint(o1, o2.position).subtract(o2.position).unit());
            return axes;
        }
        axes.push(o1.dir.normal());

        if (o1 instanceof Rectangle) {
            axes.push(o1.dir);
        }
        axes.push(o2.dir.normal());
        if (o2 instanceof Rectangle) {
            axes.push(o2.dir);
        }
        return axes;
    }

    //iterates through an objects vertices and returns the one that is the closest to the given point
    closestVertexToPoint(obj, p) {
        let closestVertex;
        let minDist = null;
        for (let i = 0; i < obj.vertices.length; i++) {
            if (p.subtract(obj.vertices[i]).mag() < minDist || minDist === null) {
                closestVertex = obj.vertices[i];
                minDist = p.subtract(obj.vertices[i]).mag();
            }
        }
        return closestVertex;
    }

    //returns the number of the axes that belong to an object
    getShapeAxes(obj) {
        if (obj instanceof Circle || obj instanceof Line) {
            return 1;
        }
        if (obj instanceof Rectangle) {
            return 2;
        }
    }

    //the ball vertices always need to be recalculated based on the current projection axis direction
    setBallVerticesAlongAxis(obj, axis) {
        if (obj instanceof Circle) {
            obj.vertices[0].position = obj.position.add(axis.unit().mult(-obj.r));
            obj.vertices[1].position = obj.position.add(axis.unit().mult(obj.r));
        }
    }
}