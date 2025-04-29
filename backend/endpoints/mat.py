"""
author: topr
last updated: 25.05.2021
currently used: yes
description: is used to manage materials (parts that either can have components below
(if is_atomic == false) or plastics (if is_atomic == true))
"""

from Models.mat import MatModel
from flask_restful import Resource, reqparse, request
from dbfunctions.connect import connect_db
from sqlalchemy import create_engine, MetaData, text
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import numpy as np


class MatEval(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mat_rw',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('price',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('co2_value',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('resource_use',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('recycling_cat',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('evaluated',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('impure',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('dangerous',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )

    def put(self, _id):
        data = MatEval.parser.parse_args()
        print(data)
        mat = MatModel.find_by_id(_id).first()

        db = connect_db()
        material = pd.read_sql_query(f'SELECT * FROM mat WHERE id={_id}', db)

        description = material["mat_desc"].tolist()[0]

        if mat:
            mat.mat_desc = description.split(
                "_Recyc_")[0] + "_Recyc_" + str(data['recycling_cat']) + "_" + str(data['mat_rw'])
            mat.mat_rw = data['mat_rw']
            mat.price = data['price']
            mat.co2_value = data['co2_value']
            mat.resource_use = data['resource_use']
            mat.recycling_cat = data['recycling_cat']
            mat.evaluated = data['evaluated']
            mat.impure = data['impure']
            mat.dangerous = data['dangerous']
            mat.save_to_db()
        return {'mat': 'mat updated successfully'}


class MatPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mat_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mat_id_int',
                        type=str,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mat_desc_int',
                        type=str,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('cad_id',
                        type=str,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mara_plast_id',
                        type=int,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mat_rw',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('height',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('width',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('depth',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('unit',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('weight',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('weight_unit',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('volume',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('volume_unit',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('is_atomic',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('orga_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('cons_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('del_kz',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('price',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('co2_value',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('resource_use',
                        type=float,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('recycling_cat',
                        type=str,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('evaluated',
                        type=int,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('impure',
                        type=str,
                        required=False,
                        help="This field cannot be blank."
                        )
    parser.add_argument('dangerous',
                        type=int,
                        required=False,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = MatPost.parser.parse_args()

        mat = MatModel(**data)
        mat.save_to_db()

        return {"message": "mat created successfully."}, 201


class Mat(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mara_plast_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )

    def put(self, _id):
        data = Mat.parser.parse_args()
        print(data)
        mat = MatModel.find_by_id(_id).first()
        if mat:
            mat.mara_plast_id = data['mara_plast_id']

            mat.save_to_db()
        return {'mat': 'mat updated successfully'}

    def delete(self, _id):
        mat = MatModel.find_by_id(_id).first()
        if mat:
            mat.delete_from_db()
        return {'mat': 'mat deleted successfully'}

# Get evaluated materials to display then for topsis in frontend


class MatEvalGet(Resource):
    def get(self, kons_id):

        db = connect_db()

        mat = pd.read_sql_query(
            f'SELECT * FROM mat WHERE evaluated=1 AND cons_id={kons_id}', db)

        mat_json = mat.fillna(np.nan).replace(
            [np.nan], [None]).to_dict(orient="records")

        return mat_json

# Get material either by orga_id or cons_id


class MatGet(Resource):
    def get(self):
        args = request.args
        if "orga_id" in args:
            mat = MatModel.find_by_orga_id(args["orga_id"])
        elif "cons_id" in args:
            mat = MatModel.find_by_cons_id(args["cons_id"])
        my_list = []
        for x in mat:
            my_list.append(dict(x))
        return my_list

# Get newest material


class MatGetNew(Resource):
    def get(self):
        db = connect_db()
        mat = pd.read_sql_query('SELECT * FROM mat', db)

        newest_mat = mat["id"].tolist()[mat.shape[0]-1]

        return newest_mat
