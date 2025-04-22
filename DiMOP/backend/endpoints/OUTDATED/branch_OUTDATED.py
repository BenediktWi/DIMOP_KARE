from flask_restful import Resource, reqparse
from Models.branch import BranchModel

class BranchGet(Resource):
    def get(self):
        branch = BranchModel.find_all_branches()
        my_list = []
        for x in branch:
            my_list.append(dict(x))
        return my_list