# from flask import Flask, Blueprint, request
# #from dbfunctions.connect import *
# #import json
# #import pandas as pd
# from flask_restful import Resource, Api, reqparse
# from datetime import datetime
# from flask_jwt import JWT, jwt_required


# app = Flask(__name__)
# app.secret_key = 'testnopy'
# api = Api(app)

# jwt = JWT(app, authenticate, identity) #/auth

# ##Muss noch durch Database ersetzt werden
# userslist = []



# #{
#  # "id": "int",
#  ## "firstname": "string",
#  # "surname": "string", 
#  # "e_mail": "string", #obligatorisch  UI bitte Email einfügen
# #  "orga_name ": "string",
#   #"function": "string",
#  # "del_kz": "boolean",
# #}



# class User(Resource):
#     #_id, firstname, lastname
   
    
#     #User_bp = Blueprint('User', __name__)
#     #@User_bp.route('/User', methods=["GET"])

#     @jwt_required()
#     def get(self, e_mail):
        



#     # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
#     # Speichert das in lokaler sqlite datenbank als dict ab
        
#         #for user1 in userslist:
#             # next = first item found by filter function, in case many entries it delivers them
#             # if no value found ..> None
#         filter_user = next(filter(lambda one_user: one_user['e_mail'] == e_mail, userslist), None) 
        
#         return {'e_mail': filter_user}, 200 if filter_user else 404
            
           
#     # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
#     # print(request.json)

#        # conn = connect_db()

#        # email = request.args.get('email')
#        # print(request.args.get('email'))

#        # df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.`function`, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id where user.e_mail='"+ email + "'", conn)

#     # Bei erfolg http status 200 zurückgeben an frontend
#     #ret = {"id_database_severs": database_server["id_database_severs"]}
#       #  print(df.head())
#        # return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}   

#     def post(self, e_mail):
        
#         if next(filter(lambda one_user: one_user['e_mail'] == e_mail, userslist), None) is not None:
#             #Error Control
#             return {'message': "E-Mailadresse '{}' ist bereits vorhanden!".format(e_mail)}, 400 #Bad Request

#         data = request.get_json()
#         user1 = {
#    "id": data['_id'],
#   #"firstname": "string",
#   #"surname": "string", 
#   "e_mail": data['e_mail'], #obligatorisch  UI bitte Email einfügen
#   #"orga_name ": "string",
#   #"function": "string",
#   #"del_kz": "boolean",
#                     }
#         userslist.append(user1)
#         return userslist, 201

#     def delete(self, e_mail):
#         pass

# class UserList(Resource):
#     def get(self):
#         return {'userslist': userslist}


# api.add_resource(User, '/user/<string:e_mail>') #http://localhost:5000/user?userid=1
# api.add_resource(UserList, '/users/<string:e_mail>') #http://localhost:5000/user?userid=1
# #api.add_resource(UserRegister, '/userregister')

# app.run(port=5000, debug=True)

# #user = (1, "Jose", "asdf")
# #insert_query_user = "INSERT INTO users VALES (?, ?, ?)"
# #curser.executemany

# select_query "SELECT * FROM users "