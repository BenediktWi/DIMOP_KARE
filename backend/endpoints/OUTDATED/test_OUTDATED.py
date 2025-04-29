from flask_restful import Resource, reqparse


class Test(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('t1',
                        type=str,
                        # required=True,
                        # help="This field cannot be blank."
                        )
    parser.add_argument('t2',
                        type=int,
                        # required=True,
                        # help="This field cannot be blank."
                        )

    def post(self):
        print("post")
        args = self.parser.parse_args()

        print(args)
        # print(args["t1"])
        # print(args["t2"])

    def put(self):
        print("put")

    def delete(self):
        print("delete")

    def get(self):
        print("get")
