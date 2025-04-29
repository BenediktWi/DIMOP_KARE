
# MANINDER SINGH 101703325

import pandas as pd
import  numpy as np
import sys
import math as m
if len(sys.argv) < 2:
    print('NOT ENOUGH ARG')
    sys.exit()

filename = sys.argv[1]
weights = sys.argv[2]
impacts = sys.argv[3]


weights = list(map(float ,weights.split(',')))
impacts = list(map(str ,impacts.split(',')))

# print(weights)
#
dataset = pd.read_csv(filename)
#dataset = pd.read_csv('data.csv')
#
# print(dataset)

data=dataset.iloc[ :,1:].values.astype(float)
# print(type(data))

(r,c)=data.shape

s=sum(weights)

if len(weights) != c:
    print("INSUFFICIENT WEIGHTS")
    sys.exit()

for i in range(c):
    weights[i]/=s


a=[0]*(c)


for i in range(0,r):
    for j in range(0,c):
        a[j]=a[j]+(data[i][j]*data[i][j])

# print(a)
for j in range(c):
    a[j]=m.sqrt(a[j])

# print(a)

for i in range(r):
    for j in range(c):
        data[i][j]/=a[j]
        data[i][j]*=weights[j]

## WEIGHTED NORMALIZED DECISION MATRIX

print(data)



ideal_positive=np.amax(data,axis=0) # MAX IN VERTICAL COL
ideal_negative=np.amin(data,axis=0) # MIN IN EACH COL
for i in range(len(impacts)):
    if(impacts[i]=='-'):         # SWAPPING TO STORE REQUIRED IN IDEAL_POSITIVE
        temp=ideal_positive[i]
        ideal_positive[i]=ideal_negative[i]
        ideal_negative[i]=temp

dist_pos=list()
dist_neg=list()

for i in range(r):
    s=0
    for j in range(c):
        s+=pow((data[i][j]-ideal_positive[j]), 2)

    dist_pos.append(float(pow(s,0.5)))


for i in range(r):
    s=0
    for j in range(c):
        s+=pow((data[i][j]-ideal_negative[j]), 2)

    dist_neg.append(float(pow(s,0.5)))


performance_score=dict()

for i in range(r):
    performance_score[i+1]=dist_neg[i]/(dist_neg[i]+dist_pos[i])

a=list(performance_score.values())
b=sorted(list(performance_score.values()) , reverse=True)

rank=dict()

for i in range(len(a)):
    rank[(b.index(a[i]) + 1)] = a[i]
    b[b.index(a[i])] =-b[b.index(a[i])]


row=list(i+1 for i in range(len(b)))
a=list(rank.values())
rr=list(rank.keys())


out={'Row_NO':row,'Performance_score' : a , 'Rank':rr}

output=pd.DataFrame(out)

print(output)
