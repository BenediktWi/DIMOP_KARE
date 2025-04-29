from flask_restful import Resource, reqparse
from Models.function import FunctionModel

class FunctionGet(Resource):
    def get(self):
        function = FunctionModel.find_all_functions()
        my_list = []
        for x in function:
            my_list.append(dict(x))
        return my_list