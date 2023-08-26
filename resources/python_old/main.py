import pygame as pg
from pygame.locals import *
import sys
from settings import *
from map import *
from player import *
from vector import *
from Object import *
from screen import *
from raycasting import *
import random

class  Game:
    objectLst: []

    def __init__(self):
        pg.init();

        self.objectLst = []
        self.forces = []
        self.flags = RESIZABLE
        # self.rect = Rect(0, 0, 1600, 1024)
        pg.mouse.set_visible(False)
        Game.screen = pg.display.set_mode(RES, self.flags)
        self.screenGame = Screen(self)

        self.clock = pg.time.Clock()
        self.delta_time = 1
        self.global_trigger = False
        self.global_event = pg.USEREVENT + 0
        pg.time.set_timer(self.global_event, 40)

        self.new_game()
        

    def new_game(self):
        test = Vector(10, 5)
        self.map = Map(self)
        self.player = Player(self)
        self.raycasting = RayCasting(self)
        # self.object_renderer = ObjectRenderer(self)
        # self.addPlanets(((self.screenGame.gameDisplay.get_width()/2),500))

    def update(self):
        for item in self.objectLst:
            # item.accelerate(self.gravity)
            item.update()

        self.player.update()
        self.raycasting.update()

        pg.display.flip();
        self.clock.tick(FPS)
        pg.display.set_caption(f'{self.clock.get_fps() :.1f}')

    def draw(self):
        self.screen.fill('black')

        for item in self.objectLst:
            item.draw()
        
        self.map.draw()
        self.player.draw()
        # self.raycasting.draw()

    def check_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE):
                pg.quit()
                sys.exit()

            if event.type == KEYDOWN:
                if event.key == K_f:
                    self.screenGame.toggle_fullscreen()

            if event.type == pg.MOUSEBUTTONUP:
                self.createNewObject()
            
    def createNewObject(self):
        pos = self.getMousePosition()
        self.addRandonsObjects(pos)
        # self.addPlanets(pos)
        # toAddObj = Object(self, Vector(pos[0], pos[1]), None, 1, 25, Vector(0,0), Vector(0,0))
        # toAddObj.accelerate(Vector(3, 3))
        # # toAddObj.accelerate(Vector(5, 5))
        # self.addObjecToWorld(toAddObj)

    def addObjecToWorld(self, obj):
        self.objectLst.append(obj)

    def getMousePosition(self):
        pos = pg.mouse.get_pos()
        return (pos)

    def run(self):
        while True:
            self.check_events()
            self.update()
            self.draw()

    qtdParticles = 50
    def addRandonsObjects(self, pos):
        for i in range(self.qtdParticles):
            obj = Object(self, Vector(pos[0]+random.randint(0,50), pos[1]+random.randint(-1,50)), None, 1, 5, Vector(random.randint(-20,20)/10, random.randint(-20,20)/10) )
            obj.addForce(Vector(0,0.02))
            self.addObjecToWorld(  obj )
        
    def addPlanets(self, pos):
        sun = Object(self, Vector(pos[0], pos[1]), None, 20000, 40, Vector(0,0) )
        sun.setSpeed(0)
        sun.setAngle(0)
        self.addObjecToWorld(  sun )

        obj = Object(self, Vector(pos[0]+200, pos[1]), None, 1, 10, Vector(0,0) )
        obj.setSun(sun)
        obj.setSpeed(12)
        obj.setAngle(-math.pi / 2)
        self.addObjecToWorld(  obj )
        
    # if event.type == pg.KEYDOWN:
    #     self.do_shortcut(event)
    
    # def do_shortcut(self, event):
    #     """Find the the key/mod combination in the dictionary and execute the cmd."""
    #     self.shortcuts = {
    #         (K_x, KMOD_LMETA): 'print("cmd+X")',
    #         (K_x, KMOD_LALT): 'print("alt+X")',
    #         (K_x, KMOD_LCTRL): 'print("ctrl+X")',
    #         (K_x, KMOD_LMETA + KMOD_LSHIFT): 'print("cmd+shift+X")',
    #         (K_x, KMOD_LMETA + KMOD_LALT): 'print("cmd+alt+X")',
    #         (K_x, KMOD_LMETA + KMOD_LALT + KMOD_LSHIFT): 'print("cmd+alt+shift+X")',
    #     }
        
    #     k = event.key
    #     m = event.mod
    #     if (k, m) in self.shortcuts:
    #         exec(self.shortcuts[k, m])
            


if __name__ == '__main__':
    game = Game()
    game.run()