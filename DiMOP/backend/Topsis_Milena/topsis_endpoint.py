from flask_restful import Resource
import numpy as np
from numpy.core import cumsum, amax, amin
from numpy.ma import array, sqrt
import pandas as pd

class Topsis(Resource):
    def get(self):
        # Entscheidungsmatrix X
        # Kriterien: Preis (€/kg) --> Min, Co2 (CO2-Äquivalent/kg Kunststoff) --> Max, RW --> Max,
        # Gewicht (siehe stpo: weight_ui) --> Min
        X= pd.read_csv('Topsis_Milena/topsis_data.csv', sep=";").values

        row_count = sum(1 for row in X)
        print(row_count)

        # Gewichtungen der Kriterien w
        w = array([0.25, 0.25, 0.25, 0.25])

        # Schrit 1: Berechnung der normalisierten Entscheidungsmatrix NX
        col_sums = array(cumsum(X ** 2, 0))
        NX = array([[round(X[i, j] / sqrt(col_sums[X.shape[0] - 1, j]), 4) for j in range(4)] for i in range(row_count)])
        print('NX =', NX)

        # Schritt 2: Berechnung der gewichteten normalisierten Entscheidungsmatrix V
        V = array([[round(w[j] * NX[i, j], 4) for j in range(4)] for i in range(row_count)])
        print("V = ", V)

        # Schrit 3: Bestimmung der idealen (A_stern) und anti-idealen Lösung (A_minus)
        A_stern = array([amin(V[:, :1]), amax(V[:, 1:2]), amax(V[:, 2:3]), amin(V[:, 3:4])])
        print("A_stern = ", A_stern)

        A_minus = array([amax(V[:, :1]), amin(V[:, 1:2]), amin(V[:, 2:3]), amax(V[:, 3:4])])
        print("A_minus = ", A_minus)

        # Schrit 4: Berechnung der Trennungsmaße D_stern und D_minus
        b1 = array([[(V[i, j] - A_stern[j]) ** 2 for i in range(row_count)] for j in range(4)])
        D_stern = np.round(sqrt(sum(b1, 0)), 4)
        print('D_stern =', D_stern)

        b2 = array([[(V[i, j] - A_minus[j]) ** 2 for i in range(row_count)] for j in range(4)])
        D_minus = np.round(sqrt(sum(b2, 0)), 4)
        print('D_minus = ', D_minus)

        # Schrit 5: Berechnung der relativen Nähe zur idealen Lösung
        Gesamtwert = array([round(D_minus[i] / (D_stern[i] + D_minus[i]), 4) for i in range(row_count)])
        print("Gesamtwert = ", Gesamtwert)
        # --> höchster Wert am besten (bei Maximierungsproblem)
        # Darstellung Ergebnis
        a = list(Gesamtwert)
        b = sorted(list(Gesamtwert), reverse=True)

        rank = dict()
        for i in range(len(a)):
            rank[(b.index(a[i]) + 1)] = a[i]
            b[b.index(a[i])] = -b[b.index(a[i])]

        row = list(i + 1 for i in range(len(b)))
        a = list(rank.values())
        rr = list(rank.keys())

        out = {'Row_NO': row, 'Gesamtwert': a, 'Rank': rr}
        output = pd.DataFrame(out)
        print(output)

        return{'Row_NO': row, 'Gesamtwert': a, 'Rank': rr}