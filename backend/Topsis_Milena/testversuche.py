import pandas as pd
import numpy as np
from numpy.core import cumsum, amax, amin
from numpy.ma import array, sqrt

X= pd.read_csv('Topsis_Milena/topsis_data.csv', sep=";").values
print(X)

row_count = sum(1 for row in X)
print(row_count)

w = array([0.25, 0.25, 0.25, 0.25])

col_sums = array(cumsum(X ** 2, 0))
NX = array([[round(X[i, j] / sqrt(col_sums[X.shape[0] - 1, j]), 4) for j in range(4)] for i in range(row_count)])
print('NX =', NX)

V = array([[round(w[j] * NX[i, j], 4) for j in range(4)] for i in range(row_count)])
print("V = ", V)

A_stern = array([amin(V[:, :1]), amax(V[:, 1:2]), amax(V[:, 2:3]), amin(V[:, 3:4])])
print("A_stern = ", A_stern)
A_minus = array([amax(V[:, :1]), amin(V[:, 1:2]), amin(V[:, 2:3]), amax(V[:, 3:4])])
print("A_minus = ", A_minus)

b1 = array([[(V[i, j] - A_stern[j]) ** 2 for i in range(row_count)] for j in range(4)])
D_stern = np.round(sqrt(sum(b1, 0)), 4)
print('D_stern =', D_stern)
b2 = array([[(V[i, j] - A_minus[j]) ** 2 for i in range(row_count)] for j in range(4)])
D_minus = np.round(sqrt(sum(b2, 0)), 4)
print('D_minus = ', D_minus)

Gesamtwert = array([round(D_minus[i] / (D_stern[i] + D_minus[i]), 4) for i in range(row_count)])
print("Gesamtwert = ", Gesamtwert)

a=list(Gesamtwert)
b=sorted(list(Gesamtwert), reverse=True)
rank=dict()
for i in range(len(a)):
    rank[(b.index(a[i]) + 1)] = a[i]
    b[b.index(a[i])] =-b[b.index(a[i])]
a=list(rank.values())
rr=list(rank.keys())
out={'Gesamtwert' : a , 'Rank':rr}
print(out)


#######################
result = Gesamtwert.tolist()
input = X.tolist()
W= {'Input Material 1 (P, CO2, RW, W)': input[0], 'Gesamtwert Material 1': result[0],
    'Input Material 2 (P, CO2, RW, W)': input[1], 'Gesamtwert Material 2': result[1],
    'Input Material 3 (P, CO2, RW, W)': input[2], 'Gesamtwert Material 3': result[2],
    'Input Material 4 (P, CO2, RW, W)': input[3], 'Gesamtwert Material 4': result[3],
    'Input Material 5 (P, CO2, RW, W)': input[4], 'Gesamtwert Material 5': result[4],
    'Input Material 6 (P, CO2, RW, W)': input[5], 'Gesamtwert Material 6': result[5],
    'Input Material 7 (P, CO2, RW, W)': input[6], 'Gesamtwert Material 7': result[6],
    'Input Material 8 (P, CO2, RW, W)': input[7], 'Gesamtwert Material 8': result[7],}
print(W)