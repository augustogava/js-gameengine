class CollisionFlat {
    static pointSegmentDistance(p, a, b) {
        let ab = FlatVector.subtract(b, a);
        let ap = FlatVector.subtract(p, a);

        let proj = MathHelper.dot(ap, ab);
        let abLenSq = MathHelper.lengthSquared(ab);
        let d = proj / abLenSq;

        let cp;
        if (d <= 0) {
            cp = a;
        } else if (d >= 1) {
            cp = b;
        } else {
            cp = a.add(ab.multiply(d));
        }

        let distanceSquared = MathHelper.distanceSquared(p, cp);
        return { distanceSquared, cp };
    }

    static intersectAABBs(a, b) {
        if (a.Max.x <= b.Min.x || b.Max.x <= a.Min.x ||
            a.Max.y <= b.Min.y || b.Max.y <= a.Min.y) {
            return false;
        }
        return true;
    }

    static findContactPoints(bodyA, bodyB) {
        let contact1 = Vector.zero();
        let contact2 = Vector.zero();
        let contactCount = 0;

        let shapeTypeA = bodyA.ShapeType;
        let shapeTypeB = bodyB.ShapeType;

        if (shapeTypeA === "Box") {
            if (shapeTypeB === "Box") {
                ({ contact1, contact2, contactCount } = findPolygonsContactPoints(bodyA.getTransformedVertices(), bodyB.getTransformedVertices()));
            } else if (shapeTypeB === "Circle") {
                contact1 = findCirclePolygonContactPoint(bodyB.Position, bodyB.Radius, bodyA.Position, bodyA.getTransformedVertices());
                contactCount = 1;
            }
        } else if (shapeTypeA === "Circle") {
            if (shapeTypeB === "Box") {
                contact1 = findCirclePolygonContactPoint(bodyA.Position, bodyA.Radius, bodyB.Position, bodyB.getTransformedVertices());
                contactCount = 1;
            } else if (shapeTypeB === "Circle") {
                contact1 = findCirclesContactPoint(bodyA.Position, bodyA.Radius, bodyB.Position);
                contactCount = 1;
            }
        }

        return { contact1, contact2, contactCount };
    }

    static findPolygonsContactPoints(verticesA, verticesB) {
        let contact1 = Vector.zero();
        let contact2 = Vector.zero();
        let contactCount = 0;

        let minDistSq = Number.MAX_VALUE;

        // for (int i = 0; i < verticesA.Length; i++)
        // {
        //         FlatVector p = verticesA[i];

        //     for (int j = 0; j < verticesB.Length; j++)
        //     {
        //             FlatVector va = verticesB[j];
        //             FlatVector vb = verticesB[(j + 1) % verticesB.Length];

        //         Collisions.PointSegmentDistance(p, va, vb, out float distSq, out FlatVector cp);

        //         if (MathHelper.NearlyEqual(distSq, minDistSq)) {
        //             if (!MathHelper.NearlyEqual(cp, contact1)) {
        //                 contact2 = cp;
        //                 contactCount = 2;
        //             }
        //         }
        //         else if (distSq < minDistSq) {
        //             minDistSq = distSq;
        //             contactCount = 1;
        //             contact1 = cp;
        //         }
        //     }
        // }

        // for (int i = 0; i < verticesB.Length; i++)
        // {
        //         FlatVector p = verticesB[i];

        //     for (int j = 0; j < verticesA.Length; j++)
        //     {
        //             FlatVector va = verticesA[j];
        //             FlatVector vb = verticesA[(j + 1) % verticesA.Length];

        //         Collisions.PointSegmentDistance(p, va, vb, out float distSq, out FlatVector cp);

        //         if (MathHelper.NearlyEqual(distSq, minDistSq)) {
        //             if (!MathHelper.NearlyEqual(cp, contact1)) {
        //                 contact2 = cp;
        //                 contactCount = 2;
        //             }
        //         }
        //         else if (distSq < minDistSq) {
        //             minDistSq = distSq;
        //             contactCount = 1;
        //             contact1 = cp;
        //         }
        //     }
        // }

        return { contact1, contact2, contactCount };
    }


    static findCirclePolygonContactPoint(circleCenter, circleRadius, polygonCenter, polygonVertices) {
        let cp = Vector.zero();

        let minDistSq = Number.MAX_VALUE;

        for (let i = 0; i < polygonVertices.length; i++) {
            let va = polygonVertices[i];
            let vb = polygonVertices[(i + 1) % polygonVertices.length];

            let { distanceSquared, cp: contact } = pointSegmentDistance(circleCenter, va, vb);

            if (distanceSquared < minDistSq) {
                minDistSq = distanceSquared;
                cp = contact;
            }
        }

        return cp;
    }


    static findCirclesContactPoint(centerA, radiusA, centerB) {
        let ab = FlatVector.subtract(centerB, centerA);
        let dir = MathHelper.normalize(ab);
        let cp = FlatVector.add(centerA, FlatVector.multiply(dir, radiusA));

        return cp;
    }

    resolveCollisionWithRotation(contact) {
        let bodyA = contact.BodyA;
        let bodyB = contact.BodyB;
        let normal = contact.Normal;
        let contact1 = contact.Contact1;
        let contact2 = contact.Contact2;
        let contactCount = contact.ContactCount;

        let e = Math.min(bodyA.Restitution, bodyB.Restitution);

        let contactList = [contact1, contact2];
        let impulseList = Array(contactCount).fill(Vector.zero());
        let raList = Array(contactCount).fill(Vector.zero());
        let rbList = Array(contactCount).fill(Vector.zero());

        for (let i = 0; i < contactCount; i++) {
            let ra = FlatVector.subtract(contactList[i], bodyA.Position);
            let rb = FlatVector.subtract(contactList[i], bodyB.Position);

            raList[i] = ra;
            rbList[i] = rb;

            let raPerp = new FlatVector(-ra.y, ra.x);
            let rbPerp = new FlatVector(-rb.y, rb.x);

            let angularLinearVelocityA = FlatVector.multiply(raPerp, bodyA.AngularVelocity);
            let angularLinearVelocityB = FlatVector.multiply(rbPerp, bodyB.AngularVelocity);

            let relativeVelocity = FlatVector.subtract(
                FlatVector.add(bodyB.LinearVelocity, angularLinearVelocityB),
                FlatVector.add(bodyA.LinearVelocity, angularLinearVelocityA)
            );

            let contactVelocityMag = MathHelper.dot(relativeVelocity, normal);

            if (contactVelocityMag > 0) {
                continue;
            }

            let raPerpDotN = MathHelper.dot(raPerp, normal);
            let rbPerpDotN = MathHelper.dot(rbPerp, normal);

            let denom = bodyA.InvMass + bodyB.InvMass +
                (raPerpDotN * raPerpDotN) * bodyA.InvInertia +
                (rbPerpDotN * rbPerpDotN) * bodyB.InvInertia;

            let j = -(1 + e) * contactVelocityMag;
            j /= denom;
            j /= contactCount;

            let impulse = FlatVector.multiply(j, normal);
            impulseList[i] = impulse;
        }

        for (let i = 0; i < contactCount; i++) {
            let impulse = impulseList[i];
            let ra = raList[i];
            let rb = rbList[i];

            bodyA.LinearVelocity = FlatVector.add(bodyA.LinearVelocity, FlatVector.multiply(-impulse, bodyA.InvMass));
            bodyA.AngularVelocity += -MathHelper.cross(ra, impulse) * bodyA.InvInertia;
            bodyB.LinearVelocity = FlatVector.add(bodyB.LinearVelocity, FlatVector.multiply(impulse, bodyB.InvMass));
            bodyB.AngularVelocity += MathHelper.cross(rb, impulse) * bodyB.InvInertia;
        }
    }



    static resolveCollision(bodyA, bodyB, normal, depth) {
        // let velocity = bodyB.velocity.subtract(bodyA.velocity);
        // let sp1 = bodyB.getSpeedByPosition();
        // let sp2 = bodyA.getSpeedByPosition();

        let velocity = bodyB.getSpeedByPosition().subtract(bodyA.getSpeedByPosition());
        velocity.multiplyBy(.05);
        // console.log(velocity.dot(normal))
        if (velocity.dot(normal) < 0) {
            velocity.multiplyBy(-1);
        }

        let e = Math.min(bodyA.restitution, bodyB.restitution);

        let j = -(1 + e) * velocity.dot(normal);
        j /= bodyA.invMass + bodyB.invMass;

        let impulse = normal.multiply(j);

        bodyA.velocity.addTo(impulse.multiply(bodyA.invMass));
        bodyB.velocity.addTo(impulse.multiply(bodyB.invMass));
    }

    static intersectCirclePolygon(circleCenter, circleRadius, polygonCenter, vertices) {
        let normal = new Vector(0, 0);
        let depth = Number.MAX_VALUE;

        let axis = new Vector(0, 0);
        let axisDepth = 0;
        let minA, maxA, minB, maxB;

        for (let i = 0; i < vertices.length; i++) {
            let va = vertices[i];
            let vb = vertices[(i + 1) % vertices.length];

            let edge = { x: vb.position.x - va.position.x, y: vb.position.y - va.position.y };
            axis = new Vector(-edge.y, edge.x);
            axis = axis.normalize();

            ({ min: minA, max: maxA } = CollisionFlat.projectVertices(vertices, axis));
            ({ min: minB, max: maxB } = CollisionFlat.projectCircle(circleCenter, circleRadius, axis));

            if (minA >= maxB || minB >= maxA) {
                return { normal: null, depth: null };
            }

            axisDepth = Math.min(maxB - minA, maxA - minB);

            if (axisDepth < depth) {
                depth = axisDepth;
                normal = axis;
            }
        }

        let cpIndex = CollisionFlat.findClosestPointOnPolygon(circleCenter, vertices);
        let cp = vertices[cpIndex];

        axis = MathHelper.normalize({ x: cp.position.x - circleCenter.x, y: cp.position.y - circleCenter.y });

        ({ min: minA, max: maxA } = CollisionFlat.projectVertices(vertices, axis));
        ({ min: minB, max: maxB } = CollisionFlat.projectCircle(circleCenter, circleRadius, axis));

        if (minA >= maxB || minB >= maxA) {
            return { normal: null, depth: null };
        }

        axisDepth = Math.min(maxB - minA, maxA - minB);

        if (axisDepth < depth) {
            depth = axisDepth;
            normal = axis;
        }

        let direction = { x: polygonCenter.x - circleCenter.x, y: polygonCenter.y - circleCenter.y };

        if (MathHelper.dot(direction, normal) < 0) {
            normal.negate();
        }

        return { normal: normal, depth: depth };
    }

    static intersectCirclePolygonWithoutCenter(circleCenter, circleRadius, vertices) {
        let normal = new Vector(0, 0);
        let depth = Number.MAX_VALUE;

        let axis = new Vector(0, 0);
        let axisDepth = 0;
        let minA, maxA, minB, maxB;

        for (let i = 0; i < vertices.length; i++) {
            let va = vertices[i];
            let vb = vertices[(i + 1) % vertices.length];

            let edge = { x: vb.position.x - va.position.x, y: vb.position.y - va.position.y };
            axis = { x: -edge.y, y: edge.x };
            axis = axis.normalize();

            ({ min: minA, max: maxA } = CollisionFlat.projectVertices(vertices, axis));
            ({ min: minB, max: maxB } = CollisionFlat.projectCircle(circleCenter, circleRadius, axis));

            if (minA >= maxB || minB >= maxA) {
                return { normal: null, depth: null };
            }

            axisDepth = Math.min(maxB - minA, maxA - minB);

            if (axisDepth < depth) {
                depth = axisDepth;
                normal = axis;
            }
        }

        let cpIndex = CollisionFlat.findClosestPointOnPolygon(circleCenter, vertices);
        let cp = vertices[cpIndex];

        axis = MathHelper.normalize({ x: cp.position.x - circleCenter.x, y: cp.position.y - circleCenter.y });

        ({ min: minA, max: maxA } = CollisionFlat.projectVertices(vertices, axis));
        ({ min: minB, max: maxB } = CollisionFlat.projectCircle(circleCenter, circleRadius, axis));

        if (minA >= maxB || minB >= maxA) {
            return { normal: null, depth: null };
        }

        axisDepth = Math.min(maxB - minA, maxA - minB);

        if (axisDepth < depth) {
            depth = axisDepth;
            normal = axis;
        }

        let polygonCenter = CollisionFlat.findArithmeticMean(vertices);
        let direction = MathHelper.subtract(polygonCenter, circleCenter);

        if (MathHelper.dot(direction, normal) < 0) {
            normal = normal.negate();
        }

        return { normal, depth };
    }

    static findClosestPointOnPolygon(circleCenter, vertices) {
        let result = -1;
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            let distance = v.position.distance(circleCenter);

            if (distance < minDistance) {
                minDistance = distance;
                result = i;
            }
        }

        return result;
    }

    static projectCircle(center, radius, axis) {
        let direction = axis.normalize();
        let directionAndRadius = direction.multiply(radius);

        let p1 = center.add(directionAndRadius);
        let p2 = center.subtract(directionAndRadius);

        let min = p1.dot(axis);
        let max = p2.dot(axis);

        if (min > max) {
            [min, max] = [max, min];
        }

        return { min, max };
    }

    static intersectPolygons(centerA, verticesA, centerB, verticesB) {
        let normal = new Vector(0, 0);
        let depth = Number.MAX_VALUE;

        let axis = new Vector(0, 0);
        let axisDepth = 0;
        let minA, maxA, minB, maxB;

        for (let i = 0; i < vertices.length; i++) {
            let va = vertices[i];
            let vb = vertices[(i + 1) % vertices.length];

            let edge = { x: vb.position.x - va.position.x, y: vb.position.y - va.position.y };
            axis = { x: -edge.y, y: edge.x };
            axis = axis.normalize();

            ({ min: minA, max: maxA } = CollisionFlat.projectVertices(vertices, axis));
            ({ min: minB, max: maxB } = CollisionFlat.projectCircle(circleCenter, circleRadius, axis));

            if (minA >= maxB || minB >= maxA) {
                return false;
            }

            axisDepth = Math.min(maxB - minA, maxA - minB);

            if (axisDepth < depth) {
                depth = axisDepth;
                normal = axis;
            }
        }

        let cpIndex = CollisionFlat.findClosestPointOnPolygon(circleCenter, vertices);
        let cp = vertices[cpIndex];

        axis = MathHelper.normalize({ x: cp.position.x - circleCenter.x, y: cp.position.y - circleCenter.y });

        ({ min: minA, max: maxA } = CollisionFlat.projectVertices(vertices, axis));
        ({ min: minB, max: maxB } = CollisionFlat.projectCircle(circleCenter, circleRadius, axis));

        if (minA >= maxB || minB >= maxA) {
            return false;
        }

        axisDepth = Math.min(maxB - minA, maxA - minB);

        if (axisDepth < depth) {
            depth = axisDepth;
            normal = axis;
        }

        let direction = centerB.subtract(centerA);

        if (MathHelper.dot(direction, normal) < 0) {
            normal = normal.negate();
        }

        return true;
    }


    // static intersectPolygonsWithoutCenter(verticesA, verticesB) {
    //     let normal = new Vector(0, 0);
    //     let depth = Number.MAX_VALUE;

    //     // ... (same logic as intersectPolygons)

    //     let centerA = CollisionFlat.findArithmeticMean(verticesA);
    //     let centerB = CollisionFlat.findArithmeticMean(verticesB);
    //     let direction = centerB.subtract(centerA);

    //     if (MathHelper.dot(direction, normal) < 0) {
    //         normal = MathHelper.negate(normal);
    //     }

    //     return { normal, depth };
    // }

    static findArithmeticMean(vertices) {
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            sumX += v.x;
            sumY += v.y;
        }

        return { x: sumX / vertices.length, y: sumY / vertices.length };
    }

    static projectVertices(vertices, axis) {
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            let proj = v.position.dot(axis);

            if (proj < min) { min = proj; }
            if (proj > max) { max = proj; }
        }

        return { min, max };
    }
    static intersectCircles(centerA, radiusA, centerB, radiusB) {
        let normal = new Vector(0, 0);
        let depth = 0;

        let distance = centerA.distance(centerB);
        let radii = radiusA + radiusB;

        if (distance >= radii) {
            return false;
        }

        normal = normal.normalize(centerB.subtract(centerA));
        depth = radii - distance;

        return { normal, depth };
    }








    //EASY

    static circleCollision(c0, c1) {
        return Utils.distance(c0, c1) <= c0.radius + c1.radius;
    }

    static circlePointCollision(x, y, circle) {
        return MathHelper.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    }

    static pointInRect(x, y, rect) {
        return Utils.inRange(x, rect.x, rect.x + rect.width) &&
            Utils.inRange(y, rect.y, rect.y + rect.height);
    }


    static rangeIntersect(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    }

    static rectIntersect(r0, r1) {
        return Utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            Utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }

}