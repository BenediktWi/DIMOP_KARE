from flask_restful import Resource, reqparse
from Models.family import FamilyModel

class FamilyPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('fam',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('fam_dimop_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('level',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('fam_weak',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = FamilyPost.parser.parse_args()

        fam = FamilyModel(**data)
        fam.save_to_db()

        return {"message": "Family added successfully."}, 201

class Family(Resource):
    def put(self, _id):
        data = FamilyPost.parser.parse_args()
        fam = FamilyModel.find_by_id(_id).first()
        if fam:
            fam.fam = data['fam']
            fam.fam_dimop_desc = data['fam_dimop_desc']
            fam.level = data['level']
            fam.fam_weak = data['fam_weak']
            fam.save_to_db()
        return {'Family': 'Family updated successfully'}

    def delete(self, _id):
        fam = FamilyModel.find_by_id(_id).first()
        if fam:
            fam.delete_from_db()
        return {'Family': 'Family deleted from project'}


class Families(Resource):
    def get(self):
        fams = FamilyModel.find_all_Families()
        my_list = []
        for x in fams:
            my_list.append(dict(x))
        return my_list

