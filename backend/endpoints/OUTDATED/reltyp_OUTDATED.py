from flask_restful import Resource, reqparse
from Models.reltyp import ReltypModel

class ReltypGet(Resource):
    def get(self):
        reltyp = ReltypModel.find_all_reltyps()
        my_list = []
        for x in reltyp:
            my_list.append(dict(x))
        return my_list