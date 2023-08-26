import pygame as pg
from pygame.locals import *
import math

class  Screen:
    def __init__(self, game):
        self.game = game
        self.flags = game.flags
        self.gameDisplay = game.screen
        # self.setScreenSize()
    
    def getWidth(self):
        return self.gameDisplay.get_width()

    def getHeight(self):
        return self.gameDisplay.get_height()

    def toggle_fullscreen(self):
        """Toggle between full screen and windowed screen."""
        self.flags ^= FULLSCREEN
        self.gameDisplay = pg.display.set_mode((0, 0), self.flags)
        # self.setScreenSize()
        

    def toggle_resizable(self):
        """Toggle between resizable and fixed-size window."""
        self.flags ^= RESIZABLE
        self.gameDisplay = pg.display.set_mode(self.rect.size, self.flags)
        # self.setScreenSize()

    def toggle_frame(self):
        """Toggle between frame and noframe window."""
        self.flags ^= NOFRAME
        self.gameDisplay =  pg.display.set_mode(self.rect.size, self.flags)