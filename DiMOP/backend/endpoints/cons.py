"""
author: topr
last updated: 25.05.2021
currently used: yes
description: used to get, add and delete constructions
"""

from flask_restful import Resource, reqparse
from Models.cons import ConsModel

import pandas as pd
from dbfunctions.connect import connect_db


class ConsPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('cons_title',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('cons_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('orga_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('del_kz',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('del_kz',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = ConsPost.parser.parse_args()

        cons = ConsModel(**data)
        cons.save_to_db()

        return {"message": "Cons created successfully."}, 201


class Cons(Resource):
    def get(self, orga_id):
        cons = ConsModel.find_by_orga_id(orga_id)
        my_list = []
        for x in cons:
            my_list.append(dict(x))

        return my_list


class ConsAlter(Resource):
    def delete(self, _id):
        cons = ConsModel.find_by_id(_id).first()
        if cons:
            cons.del_kz = 1
            cons.save_to_db()
        return {'cons': 'cons deleted successfully'}
