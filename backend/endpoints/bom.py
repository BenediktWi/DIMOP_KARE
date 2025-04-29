"""
author: topr
last updated: 25.05.2021
currently used: yes
description: used to get, add and delete bom entries
"""

from flask_restful import Resource, reqparse
from Models.bom import BomModel
from Models.rel import RelModel
from dbfunctions.connect import connect_db
from sqlalchemy import create_engine, MetaData, text
from flask_sqlalchemy import SQLAlchemy
import pandas as pd


class Bom(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("mat_id",
                        type=int,
                        required=True,
                        help="This field cannot be blank.")
    parser.add_argument("parent_mat_id",
                        type=int,
                        required=True,
                        help="This field cannot be blank.")

    def post(self):
        data = Bom.parser.parse_args()
        print(data)
        bom = BomModel(**data)
        bom.save_to_db()

        return {"bom": "entry created successfully."}, 201

    def get(self):
        bom = BomModel.find_all()
        my_list = []
        for x in bom:
            my_list.append(dict(x))
        return my_list


class BomAlter(Resource):
    def delete(self, _id):
        db = connect_db()
        rel = pd.read_sql_query('SELECT * FROM rel', db)
        bom = pd.read_sql_query('SELECT * FROM bom', db)

        print(int(_id))
        print(type(_id))
        delete_bom_parent = bom.loc[bom["id"] == int(_id)]["parent_mat_id"].tolist()[
            0]
        delete_bom_material = bom.loc[bom["id"]
                                      == int(_id)]["mat_id"].tolist()[0]

        # Delete bom entry
        bom_model_entry = BomModel.find_by_id(_id).first()
        if bom_model_entry:
            bom_model_entry.delete_from_db()

        bom = pd.read_sql_query('SELECT * FROM bom', db)

        # Check if there are other bom entries with deleted mat_id
        # If there are no other entries, delete all relations
        if(len(bom.loc[(bom["parent_mat_id"] == delete_bom_parent) & (bom["mat_id"] == delete_bom_material)]) == 0):
            print("Delete relations.")

            # Find all relations
            mat_rels = rel.loc[(rel["p_id"] == delete_bom_parent) & (((rel["m1_id"] == delete_bom_material) | (
                (rel["m2_id"] == delete_bom_material))))]["id"].tolist()

            # Iterate through relations and relete
            for mat_rel in mat_rels:
                rel = RelModel.find_by_id(mat_rel).first()
                if rel:
                    rel.delete_from_db()
                print(F"Relation {mat_rel} deleted.")

        # If there is only one entry left, delte mat_rel to mat_rel relation
        elif(len(bom.loc[(bom["parent_mat_id"] == delete_bom_parent) & (bom["mat_id"] == delete_bom_material)]) == 1):

            # Find relation
            mat_rel = rel.loc[(rel["p_id"] == delete_bom_parent) & (((rel["m1_id"] == delete_bom_material) & (
                (rel["m2_id"] == delete_bom_material))))]["id"].tolist()[0]
            rel = RelModel.find_by_id(mat_rel).first()

            # Delete relation
            if rel:
                rel.delete_from_db()
                print(F"Relation {mat_rel} deleted.")
        # If there are other entries, do not delete relations
        else:
            print("Do not delete relations.")

        return {"bom": "bom and rel entry deleted successfully deleted successfully"}
