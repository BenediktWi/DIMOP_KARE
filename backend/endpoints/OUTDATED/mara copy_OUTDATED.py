from flask_restful import Resource, reqparse
from Models.mara import MaraModel

class MaraPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mara_nr',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
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
    parser.add_argument('dichte',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = MaraPost.parser.parse_args()

        mara = MaraModel(**data)
        mara.save_to_db()

        return {"message": "material created successfully."}, 201


class Mara(Resource):
    def put(self, _id):
        data = MaraPost.parser.parse_args()
        mara = MaraModel.find_by_id(_id).first()
        if mara:
            mara.mara_nr = data['mara_nr']
            mara.mat_desc = data['mat_desc']
            mara.t_fam_id = data['t_fam_id']
            mara.dichte = data['dichte']
            # Anmerkung Tobi: Eventuell muesste man Dichte hier umbenennen
            mara.save_to_db()
        return {'mara': 'material updated successfully'}

    def delete(self, _id):
        mara = MaraModel.find_by_id(_id).first()
        if mara:
            mara.delete_from_db()
        return {'mara': 'material deleted successfully'}

class MaraGet(Resource):
    def get(self, user_id):
        mara = MaraModel.find_by_user_id(user_id)
        my_list = []
        for x in mara:
            my_list.append(dict(x))
        return my_list

