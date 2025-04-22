"""
author: topr
last updated: 11.11.2020
currently used: no
description: includes topsis function
"""

from flask_restful import Resource, reqparse
from dbfunctions.connect import db
from sqlalchemy import create_engine, MetaData, text
from flask_sqlalchemy import SQLAlchemy
from topsis import topsis

# topsis_weights = {"price": 0.7, "co2": 0.2, "recycling": 0.1}
# topsis_data = [
#    {
#        "id": 1,
#        "mat_desc": "Elektrische Zahnbuerste A",
#        "price": 1.9,
#        "co2": 0.75,
#        "recycling": 0.75
#    },
#    {
#        "id": 2,
#        "mat_desc": "Elektrische Zahnbuerste B",
#        "price": 2.0,
#        "co2": 0.8,
#        "recycling": 0.9
#    },
#    {
#        "id": 3,
#        "mat_desc": "Elektrische Zahnbuerste C",
#        "price": 1.6,
#        "co2": 0.7,
#        "recycling": 0.55
#    },
#    {
#        "id": 4,
#        "mat_desc": "Elektrische Zahnbuerste D",
#        "price": 1.2,
#        "co2": 0.8,
#        "recycling": 0.3
#    }]


class TopsisTobi(Resource):

    def post(self, topsis_data, topsis_weights):
        weights = list(topsis_weights.values())
        alternatives = [list(element.values())[2:] for element in topsis_data]
        directions = [0, 1, 1]  # 0 = minimize, 1 = maximize
        result = topsis(alternatives, weights, directions)
        result.calc()
        scores = result.C
        ranks = [sorted(scores, reverse=True).index(x)+1 for x in scores]
        for i in range(0, len(scores)):
            topsis_data[i]["score"] = scores[i]
            topsis_data[i]["ranks"] = ranks[i]
        return topsis_data
