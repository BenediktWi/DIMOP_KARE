from flask_restful import Resource, reqparse
from Models.comp import CompModel


class CompPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('t_fam_id_parent',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('t_fam_id_child',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('t_origin_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('user_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('orga_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('comp_value',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    def post(self):
        data = CompPost.parser.parse_args()

        comp = CompModel(**data)
        comp.save_to_db()

        return {"message": "comp created successfully."}, 201


class Comp(Resource):
    def put(self, _id):
        data = CompPost.parser.parse_args()
        comp = CompModel.find_by_id(_id).first()
        if comp:
            comp.t_fam_id_parent = data['t_fam_id_parent']
            comp.t_fam_id_child = data['t_fam_id_child']
            comp.t_origin_id = data['t_origin_id']
            comp.user_id = data['user_id']
            comp.orga_id = data['orga_id']
            comp.comp_value = data['comp_value']
            comp.save_to_db()
        return {'comp': 'comp updated successfully'}

    def delete(self, _id):
        comp = CompModel.find_by_id(_id).first()
        if comp:
            comp.delete_from_db()
        return {'comp': 'comp deleted successfully'}

class CompGet(Resource):
    def get(self, t_fam_id):
        comp = CompModel.find_by_t_fam_id(t_fam_id)
        my_list = []
        for x in comp:
            my_list.append(dict(x))
        return my_list