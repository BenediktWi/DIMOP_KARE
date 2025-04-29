from flask_restful import Resource, reqparse
from Models.origin import OriginModel

class OriginGet(Resource):
    def get(self):
        origin = OriginModel.find_all_origins()
        my_list = []
        for x in origin:
            my_list.append(dict(x))
        return my_list