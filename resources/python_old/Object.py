import pygame as pg
from settings import *
from vector import *
import math

class Object:
    forces: []

    def __init__(self, game, position, size, mass, radius, velocity):
        self.game = game
        self.position = Vector(position.getX(), position.getY())
        
        if size != None:
            self.size = size if size is not None else Vector(0, 0)

        if radius != None:
            self.radius = radius
        
        if velocity != None:
            self.velocity = velocity if velocity is not None else Vector(0, 0)
        
        # if accell != None:
        #     self.acceleration = accell if accell is not None else Vector(0, 0)
        self.mass = mass
        self.thrust = Vector(0, 0)
        self.angle = 0
        self.sun = None
        self.forces = []

        # self.velocity.setLength(3)
        # self.velocity.setAngle(math.pi / 6)
    
    def addForce(self, force):
        self.forces.append(force)

    def setSun(self, sun):
        self.sun = sun

    def update(self):
        for f in self.forces:
            self.velocity.addTo(f)
        
        # self.velocity.multiplyBy(0.99)
    
        if self.sun != None:
            self.gravitateTo(self.sun)
    
        self.velocity.addTo(self.thrust)

        self.position.addTo(self.velocity)
        # self.thrust.setAngle(self.angle)


        if self.position.getX() > self.game.screenGame.getWidth() :
            self.position.setX(0)
               
        if self.position.getX() < 0 :
            self.position.setX(self.game.screenGame.getWidth())
               
        if self.position.getY() > self.game.screenGame.getHeight() :
            self.position.setY(0)
                        	
        if self.position.getY() < 0 :
            self.position.setY(self.game.screenGame.getHeight())
	
    # def rot_center(image, angle, x, y):
    #     rotated_image = pg.transform.rotate(image, angle)
    #     new_rect = rotated_image.get_rect(center = image.get_rect(center = (x, y)).center)

    #     return rotated_image, new_rect

    def draw(self):
        pg.draw.circle(self.game.screen, 'white', (self.position.getX(), self.position.getY()), self.radius)

    def accelerate(self, accell):
         self.velocity.addTo(accell)

    def setAngle(self, angle):
         self.angle = angle
         self.velocity.setAngle(angle)
    
    def setSpeed(self, speed):
        self.velocity.setLength(speed)
             
    def angleTo(self, p2):
        return math.atan2(p2.position.getY() - self.position.getY(), p2.position.getX() - self.position.getX())

    def distanceTo(self, p2):
        dx = p2.position.getX() - self.position.getX()
        dy = p2.position.getY() - self.position.getY()

        return math.sqrt(dx * dx + dy * dy)

    def gravitateTo(self, p2):
        grav = Vector(0, 0)
        dist = self.distanceTo(p2)

        grav.setLength(p2.mass / (dist * dist))
        grav.setAngle(self.angleTo(p2))
        self.velocity.addTo(grav)