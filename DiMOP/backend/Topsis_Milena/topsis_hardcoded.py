import numpy as np
from numpy.core import cumsum, amax, amin
from numpy.ma import array, sqrt

# Entscheidungsmatrix X
# Kriterien: Preis (€/kg) --> Min, Co2 (CO2-Äquivalent/kg Kunststoff) --> Max, RW --> Max,
# Gewicht (siehe stpo: weight_ui) --> Min
X = array([[0.89, 2.31, 0.73, 0.1060],
           [1.45, 1.79, 0.84, 0.0408],
           [1.86, 2.45, 0.54, 0.0235],
           [2.40, 1.89, 0.89, 0.0089],
           [1.78, 2.78, 0.46, 0.0605],
           [3.10, 2.41, 0.37, 0.1003],
           [0.56, 1.67, 0.81, 0.0378],
           [2.65, 0.97, 0.58, 0.0087]])

# Gewichtungen der Kriterien w
w = array([0.25, 0.25, 0.25, 0.25])

# Schrit 1: Berechnung der normalisierten Entscheidungsmatrix NX
col_sums = array(cumsum(X**2, 0))
NX = array([[round(X[i, j] / sqrt(col_sums[X.shape[0]-1, j]), 4) for j in range(4)] for i in range(8)])
print('NX =', NX)

# Schritt 2: Berechnung der gewichteten normalisierten Entscheidungsmatrix V
V = array([[round(w[j] * NX[i, j], 4) for j in range(4)] for i in range(8)])
print ("V = ",V)

# Schrit 3: Bestimmung der idealen (A_stern) und anti-idealen Lösung (A_minus)
A_stern = array([amin(V[:, :1]), amax(V[:, 1:2]),amax(V[:, 2:3]), amin(V[:, 3:4])])
print ("A_stern = ",A_stern)

A_minus = array([amax(V[:, :1]), amin(V[:, 1:2]),amin(V[:, 2:3]), amax(V[:, 3:4])])
print ("A_minus = ",A_minus)

# Schrit 4: Berechnung der Trennungsmaße D_stern und D_minus
b1 = array([[(V[i, j] - A_stern[j])**2  for i in range(8)]for j in range(4)])
D_stern = np.round(sqrt(sum(b1, 0)),4)
print ('D_stern =',D_stern)

b2 = array([[(V[i, j] - A_minus[j])**2 for i in range(8)]for j in range(4)])
D_minus = np.round(sqrt(sum(b2, 0)),4)
print ('D_minus = ',D_minus)

# Schrit 5: Berechnung der relativen Nähe zur idealen Lösung
Gesamtwert = array([round(D_minus[i] / (D_stern[i] + D_minus[i]),4) for i in range(8)])
print("Gesamtwert = ", Gesamtwert)
# --> höchster Wert am besten (bei Maximierungsproblem)