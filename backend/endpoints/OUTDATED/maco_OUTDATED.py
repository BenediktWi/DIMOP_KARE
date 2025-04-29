from flask_restful import Resource, reqparse
from Models.maco import MacoModel

class MacoPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('stpo_id_comp_a',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('stpo_id_comp_b',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('t_reltyp_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mass_product',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = MacoPost.parser.parse_args()

        maco = MacoModel(**data)
        maco.save_to_db()

        return {"message": "maco created successfully."}, 201


class Maco(Resource):
    def put(self, _id):
        data = MacoPost.parser.parse_args()
        maco = MacoModel.find_by_id(_id).first()
        if maco:
            maco.stpo_id_comp_a = data['stpo_id_comp_a']
            maco.stpo_id_comp_b = data['stpo_id_comp_b']
            maco.t_reltyp_id = data['t_reltyp_id']
            maco.mass_product = data['mass_product']
            maco.save_to_db()
        return {'maco': 'maco updated successfully'}

    def delete(self, _id):
        maco = MacoModel.find_by_id(_id).first()
        if maco:
            maco.delete_from_db()
        return {'maco': 'maco deleted successfully'}

class MacoGet(Resource):
    def get(self, stpo_id):
        maco = MacoModel.find_by_stpo_id(stpo_id)
        my_list = []
        for x in maco:
            my_list.append(dict(x))
        return my_list