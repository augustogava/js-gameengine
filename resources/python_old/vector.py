from settings import *
import math

class  Vector:
    def __init__(self, x, y):
        self._x = x
        self._y = y
    
    def setX(self, x):
        self._y = x

    def setY(self, y):
        self._y = y
    
    def getX(self):
        return self._x

    def getY(self):
        return self._y

    def setAngle(self, angle):
        length = self.length()
        self._x = math.cos(angle) * length
        self._y = math.sin(angle) * length
    
    def angle(self):
        return math.atan2(self._y, self._x)
    
    def setLength(self, length):
        angle = self.angle()
        self._x = math.cos(angle) * length
        self._y = math.sin(angle) * length
    
    def length(self):
        return math.sqrt( ( self._x * self._x ) + ( self._y * self._y ) )

    def distance(self, vector): 
        dx = vector.getX() - self._x;
        dy = vector.getY() - self._y;

        return math.sqrt(dx * dx + dy * dy);

    def add(self, vector):
        return Vector(self._x + vector.getX(), self._y + vector.getY());

    def subtract(self, vector):
        return Vector(self._x - vector.getX(), self._y - vector.getY());

    def multiply(self, vector):
        return Vector(self._x * vector.getX(), self._y * vector.getY());

    def divide(self, vector):
        return Vector(self._x / vector.getX(), self._y / vector.getY());

    def addTo(self, vector):
        self._x += vector.getX()
        self._y += vector.getY()

    def subtractFrom(self, vector):
        self._x -= vector.getX()
        self._y -= vector.getY()

    def multiplyBy(self, value):
        self._x *= value
        self._y *= value

    def divideBy(self, value):
        self._x /= value
        self._y /= value

    # def scale(vector):
    #     return Vector(self._x * vector, this.y * vector);

# export class Vector {
#     constructor(x, y) {
#         this.x = x;
#         this.y = y;
#     }

#     length() {
#         return Math.sqrt(this.x * this.x + this.y * this.y);
#     }

#     setLength(value) {
#         const ratio = value / this.length;
#         this.x *= ratio;
#         this.y *= ratio;
#     }

#     add(vector) {
#         return new Vector(this.x + vector.x, this.y + vector.y);
#     }

#     mult(value) {
#         return new Vector(this.x * value, this.y * value);
#     }

#     sub(vector) {
#         return new Vector(this.x - vector.x, this.y - vector.y);
#     }

#     distance(vector) {
#         const dx = vector.x - this.x;
#         const dy = vector.y - this.y;

#         return Math.sqrt(dx * dx + dy * dy);
#     }



#     scale(vector) {
#         return new Vector(this.x * vector, this.y * vector);
#     }

#     magnitude() {
#         return Math.sqrt(this.x * this.x + this.y * this.y);
#     }

#     normalize() {
#         const length = this.length();
#         if (length == 0)
#             return this;

#         return new Vector(this.x / length, this.y / length);
#     }

#     unit() {
#         const magnitude = this.magnitude();
#         return new Vector(this.x / magnitude, this.y / magnitude);
#     }

#     dot(vector) {
#         return this.x * vector.x + this.y * vector.y;
#     }

#     cross(vector) {
#         return this.x * vector.y - this.y * vector.x;
#     }

#     rotate(angle) {
#         const cos = Math.cos(angle);
#         const sin = Math.sin(angle);
#         return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
#     }

#     angle(vector2) {
#         return Math.atan2(this.cross(vector2), this.dot(vector2));
#     }

#     project(vector2) {
#         const scale = this.dot(vector2) / vector2.dot(vector2);
#         return vector2.scale(scale);
#     }

#     getOverlap(otherVector) {
#         return Math.min(this.x, otherVector.x) * Math.min(this.y, otherVector.y);
#     }

#     perpendicular() {
#         return new Vector(-this.y, this.x);
#     }

#     projectOnto(vector) {
#         const unit = this.unit();
#         return unit.mult(unit.dot(vector));
#     }
# }