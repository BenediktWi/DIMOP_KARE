"""
author: topr
last updated: -
currently used: yes
description: endpoints for plast table that contains all plastics
"""

from flask_restful import Resource, reqparse
from Models.plast import PlastModel


class PlastPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mat_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('t_fam_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('dichte_trocken',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = PlastPost.parser.parse_args()

        plast = PlastPost(**data)
        plast.save_to_db()

        return {"message": "material created successfully."}, 201


class Plast(Resource):
    def put(self, _id):
        data = PlastPost.parser.parse_args()
        plast = PlastModel.find_by_id(_id).first()
        if plast:
            plast.mat_desc = data['mat_desc']
            plast.t_fam_id = data['t_fam_id']
            plast.dichte_trocken = data['dichte_trocken']
            plast.save_to_db()
        return {'plast': 'material updated successfully'}

    def delete(self, _id):
        plast = PlastModel.find_by_id(_id).first()
        if plast:
            plast.delete_from_db()
        return {'plast': 'material deleted successfully'}


class PlastGet(Resource):
    def get(self):
        plast = PlastModel.find_all()
        my_list = []
        for x in plast:
            my_list.append(dict(x))
        return my_list
