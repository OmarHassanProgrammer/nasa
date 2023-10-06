import pykep as pk
from pykep.orbit_plots import plot_planet, plot_lambert
from pykep import AU, DAY2SEC
#import pygmo as pg
import numpy as np
import math

# Plotting imports
#import matplotlib as mpl
#from mpl_toolkits.mplot3d import Axes3D
#import matplotlib.pyplot as plt

t1 = pk.epoch(0)
t2 = pk.epoch(640)
dt = (t2.mjd2000 - t1.mjd2000) * DAY2SEC

earth = pk.planet.jpl_lp('earth')
rE, vE = earth.eph(t1)

mars = pk.planet.jpl_lp('mars')
rM, vM = mars.eph(t2)
def norm(l):
    return math.sqrt(l[0] ** 2 + l[1] ** 2 + l[2] ** 2)

# We solve the Lambert problem
l = pk.lambert_problem(r1 = rE, r2 = rM, tof = dt, mu = pk.MU_SUN, max_revs=2)
a = 1 / ((2 / norm(l.get_v1()[0])) - (norm(l.get_v2()[0]) ** 2 / pk.MU_SUN))
b = norm(l.get_v2()[0]) / (2 * norm(l.get_v2()[0]) - norm(l.get_v1()[0]))
e = (1 - (b / a) ** 2) ** 0.5

print(a)
print(b)
print(e)
#print(l.)
