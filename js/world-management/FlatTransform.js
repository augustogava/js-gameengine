class FlatTransform {
    PositionX;
    PositionY;
    Sin;
    Cos;

    Zero = new FlatTransform(0, 0, 0);

    FlatTransform(position, angle) {
        this.PositionX = position.X;
        this.PositionY = position.Y;
        this.Sin = MathF.Sin(angle);
        this.Cos = MathF.Cos(angle);
    }

    FlatTransform(x, y, angle) {
        this.PositionX = x;
        this.PositionY = y;
        this.Sin = MathF.Sin(angle);
        this.Cos = MathF.Cos(angle);
    }
}

class FlatManifold {
    constructor(bodyA, bodyB, normal, depth, contact1, contact2, contactCount) {
        this.BodyA = bodyA;
        this.BodyB = bodyB;
        this.Normal = normal;
        this.Depth = depth;
        this.Contact1 = contact1;
        this.Contact2 = contact2;
        this.ContactCount = contactCount;
    }
}