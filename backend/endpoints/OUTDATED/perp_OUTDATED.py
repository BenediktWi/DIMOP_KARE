from flask_restful import Resource, reqparse
from Models.perp import PerpModel

class PerpPost(Resource):
    parser = reqparse.RequestParser()
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
    parser.add_argument('kons_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('auth_read',
                        type=bool,
                        required=True,
                        help="This field is optional, but a real Name should be used ;)."
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
    parser.add_argument('del_kz',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = PerpPost.parser.parse_args()

        perp = PerpModel(**data)
        perp.save_to_db()

        return {"message": "PerP added successfully."}, 201

class Perp(Resource):
    parser = reqparse.RequestParser()
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
        data = Perp.parser.parse_args()
        perp = PerpModel.find_by_id(_id).first()
        if perp:
            perp.auth_read = data['auth_read']
            perp.auth_write = data['auth_write']
            perp.auth_delete = data['auth_delete']
            perp.save_to_db()
        return {'perp': 'Perp updated successfully'}

    def delete(self, _id):
        perp = PerpModel.find_by_id(_id).first()
        if perp:
            perp.delete_from_db()
        return {'perp': 'Person deleted from project'}

class PerpGet(Resource):
    def get(self, kons_id):
        perp = PerpModel.find_by_kons_id(kons_id)
        my_list = []
        for x in perp:
            my_list.append(dict(x))
        return my_list

