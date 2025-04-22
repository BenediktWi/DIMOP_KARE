from flask_restful import Resource, reqparse
from Models.BomAl import BomAlModel
from datetime import datetime

class BomAlPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('bom_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bom_al',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bom_al_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('user_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('kons_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mara_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('fav',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('cad_nr',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_read',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_write',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_delete',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_orga',
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
        data = BomAlPost.parser.parse_args()

        bomal = BomAlModel(**data)
        bomal.save_to_db()

        return {"message": "BomAl created successfully."}, 201


class BomAl(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('bom_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bom_al',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bom_al_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('user_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('kons_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mara_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('fav',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('cad_nr',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_read',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_write',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_delete',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )

    def put(self, _id):
        data = BomAl.parser.parse_args()
        bomal = BomAlModel.find_by_id(_id).first()
        if bomal:
            bomal.bom_desc = data['bom_desc']
            bomal.bom_al = data['bom_al']
            bomal.bom_al_desc = data['bom_al_desc']
            bomal.user_id = data['user_id']
            bomal.kons_id = data['kons_id']
            bomal.mara_id = data['mara_id']
            bomal.fav = data['fav']
            bomal.cad_nr = data['cad_nr']
            bomal.auth_read = data['auth_read']
            bomal.auth_write = data['auth_write']
            bomal.auth_delete = data['auth_delete']
            bomal.save_to_db()
        return {'bomal': 'bomal updated successfully'}

    def delete(self, _id):
        bomal = BomAlModel.find_by_id(_id).first()
        if bomal:
            bomal.delete_from_db()
        return {'bomal': 'bomal deleted successfully'}

class BomAlGet(Resource):
    def get(self, kons_id):
        bomal = BomAlModel.find_by_kons_id(kons_id)
        my_list = []
        for x in bomal:
            my_list.append(dict(x))
        return my_list
