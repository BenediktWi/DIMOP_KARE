from flask_restful import Resource, reqparse
from Models.orga import OrgaModel

class OrgaPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('orga_nr',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('orga_name',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('t_branch_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = OrgaPost.parser.parse_args()

        orga = OrgaModel(**data)
        orga.save_to_db()

        return {"message": "Orga added successfully."}, 201

class Orga(Resource):
    def put(self, _id):
        data = OrgaPost.parser.parse_args()
        orga = OrgaModel.find_by_id(_id).first()
        if orga:
            orga.orga_nr = data['orga_nr']
            orga.orga_name = data['orga_name']
            orga.t_branch_id = data['t_branch_id']
            orga.save_to_db()
        return {'orga': 'Orga updated successfully'}

    def delete(self, _id):
        orga = OrgaModel.find_by_id(_id).first()
        if orga:
            orga.delete_from_db()
        return {'orga': 'Orga deleted from project'}


class Orgas(Resource):
    def get(self):
        orgas = OrgaModel.find_all_Orgas()
        my_list = []
        for x in orgas:
            my_list.append(dict(x))
        return my_list

