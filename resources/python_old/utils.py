import math

class  Utils:
    def __init__(self, game):
        self.game = game

    def norm(self, value, min, max) :
        return (value - min) / (max - min)

    def lerp(self, norm, min, max) :
        return (max - min) * norm + min

    def map(self, value, sourceMin, sourceMax, destMin, destMax) :
        return self.lerp(self.norm(value, sourceMin, sourceMax), destMin, destMax)

    def clamp(self, value, min, max) :
        return math.min(math.max(value, math.min(min, max)), math.max(min, max))

    def distance(self, p0, p1) :
        dx = p1.x - p0.x
        dy = p1.y - p0.y
        
        return math.sqrt(dx * dx + dy * dy)

    def distanceXY(self, x0, y0, x1, y1):
        dx = x1 - x0
        dy = y1 - y0

        return math.sqrt(dx * dx + dy * dy)

    def circleCollision(self, c0, c1) :
        return self.distance(c0, c1) <= c0.radius + c1.radius

    def circlePointCollision(self, x, y, circle) :
        return self.distanceXY(x, y, circle.x, circle.y) < circle.radius

    def pointInRect(self, x, y, rect) :
        return self.inRange(x, rect.x, rect.x + rect.width) and  self.inRange(y, rect.y, rect.y + rect.height)

    def inRange(self, value, min, max) :
        return value >= math.min(min, max) and value <= math.max(min, max)

    def rangeIntersect(self, min0, max0, min1, max1):
        return math.max(min0, max0) >= math.min(min1, max1) and math.min(min0, max0) <= math.max(min1, max1)

    def rectIntersect(self, r0, r1):
        return self.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) and self.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)