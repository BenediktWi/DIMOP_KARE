"""
author: topr
last updated: 16.12.2020
currently used: yes
description: used to save relations of siblings
"""

from Models.rel import RelModel
from flask_restful import Resource, reqparse
from dbfunctions.connect import connect_db
from sqlalchemy import create_engine, MetaData, text
from flask_sqlalchemy import SQLAlchemy
import pandas as pd


class Rel(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("p_id",
                        type=int,
                        required=True,
                        help="This field cannot be blank.")
    parser.add_argument("m1_id",
                        type=int,
                        required=True,
                        help="This field cannot be blank.")
    parser.add_argument("m2_id",
                        type=int,
                        required=True,
                        help="This field cannot be blank.")
    parser.add_argument("rel_type",
                        type=int,
                        required=True,
                        help="This field cannot be blank.")

    def post(self):

        data = Rel.parser.parse_args()

        print(data)

        db = connect_db()
        rel = pd.read_sql_query('SELECT * FROM rel', db)

        p_id = data['p_id']
        m1_id = data['m1_id']
        m2_id = data['m2_id']
        rel_type = data['rel_type']

        # If there is no relation with the combinations m1_id to m2_id or m2_id to m1_id for the parent p_id, create relation
        if(len(rel.loc[(rel["p_id"] == p_id) & ((((rel["m1_id"] == m1_id) & (rel["m2_id"] == m2_id))) | (((rel["m1_id"] == m2_id) & (rel["m2_id"] == m1_id))))]) == 0):
            rel = RelModel(**data)
            rel.save_to_db()

            return {"rel": "entry created successfully."}, 201

        # If there is already a relation, update rel_type
        else:
            rel_id = rel.loc[(rel["p_id"] == p_id) & ((((rel["m1_id"] == m1_id) & (rel["m2_id"] == m2_id))) | (
                ((rel["m1_id"] == m2_id) & (rel["m2_id"] == m1_id))))]["id"].tolist()[0]

            result = db.execute(
                F"UPDATE rel SET rel_type={rel_type} WHERE id={rel_id}")

            return {"rel": "entry already exists. But rel_type was set to new value."}, 201


# class RelGet(Resource):
#    def get(self):
#        rel = RelModel.find_all()
#        my_list = []
#        for x in rel:
#            my_list.append(dict(x))
#        return my_list


# class RelAlter(Resource):
#    def delete(self, _id):
#        rel = RelModel.find_by_id(_id).first()
#        if rel:
#            rel.delete_from_db()
#        return {"rel": "entry #deleted successfully"}
