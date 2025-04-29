from flask_restful import Resource, reqparse
from Models.BomItem import BomItemModel

class BomItemPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mast_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mara_id',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('pos',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('height_erp',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('width_erp',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('depth_erp',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('unit_erp',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('volume_cad',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('unit_cad',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('weight_ui',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('qr_relevant',
                        type=int,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = BomItemPost.parser.parse_args()

        bomitem = BomItemModel(**data)
        bomitem.save_to_db()

        return {"message": "bomitem created successfully."}, 201


class BomItem(Resource):
    def put(self, _id):
        data = BomItemPost.parser.parse_args()
        bomitem = BomItemModel.find_by_id(_id).first()
        if bomitem:
            bomitem.mast_id = data['mast_id']
            bomitem.mara_id = data['mara_id']
            bomitem.pos = data['pos']
            bomitem.height_erp = data['height_erp']
            bomitem.width_erp = data['width_erp']
            bomitem.depth_erp = data['depth_erp']
            bomitem.unit_erp = data['unit_erp']
            bomitem.volume_cad = data['volume_cad']
            bomitem.unit_cad = data['unit_cad']
            bomitem.weight_ui = data['weight_ui']
            bomitem.qr_relevant = data['qr_relevant']
            bomitem.save_to_db()
        return {'bomitem': 'bomitem updated successfully'}

    def delete(self, _id):
        bomitem = BomItemModel.find_by_id(_id).first()
        if bomitem:
            bomitem.delete_from_db()
        return {'bomitem': 'bomitem deleted successfully'}

class BomItemGet(Resource):
    def get(self, mast_id):
        bomitem = BomItemModel.find_by_mast_id(mast_id)
        my_list = []
        for x in bomitem:
            my_list.append(dict(x))
        return my_list

