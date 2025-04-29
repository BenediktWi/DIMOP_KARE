"""
author: nopy/fascha
last updated: ?
currently used: yes
description: ?
"""

from flask_restful import Resource, reqparse
from Models.user import UserModel
import hashlib
import uuid
from datetime import datetime


class UserPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('firstname',
                        type=str,
                        required=True,
                        help="This field is optional, but a real Name should be used ;)."
                        )
    # parser.add_argument('surname',
    #                   type=str,
    #                  required=True,
    #                 help="This field is optional, but a real Name should be used ;)."
    #                )
    parser.add_argument('t_function_id',
                        type=int,
                        required=True,
                        help="This field is optional, but a real Name should be used ;)."
                        )
    parser.add_argument('orga_id',
                        type=int,
                        required=True,
                        help="This field is optional, but a real Name should be used ;)."
                        )
    parser.add_argument('e_mail',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('password',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('del_kz',
                        type=bool,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = UserPost.parser.parse_args()

        password = data["password"]

        salt = uuid.uuid4().hex
        hashed_password = hashlib.sha512(password.encode(
            'utf-8') + salt.encode('utf-8')).hexdigest()

        data["password"] = hashed_password
        data["pw_salt"] = salt

        if UserModel.find_by_e_mail(data["e_mail"]):
            return {"message": "A user with that e_mail already exists"}, 400

        user = UserModel(**data)  # (data["e_mail"], data["password"])
        user.save_to_db()

        return {"message": "User created successfully."}, 201


class User(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('firstname',
                        type=str,
                        required=True,
                        help="ID field cannot be blank."
                        )
    parser.add_argument('surname',
                        type=str,
                        required=True,
                        help="ID field cannot be blank."
                        )
    parser.add_argument('t_function_id',
                        type=int,
                        required=True,
                        help="ID field cannot be blank."
                        )
    parser.add_argument('e_mail',
                        type=str,
                        required=True,
                        help="ID field cannot be blank."
                        )
    parser.add_argument('orga_id',
                        type=int,
                        required=True,
                        help="Please enter your Company :)"
                        )

    def put(self, _id):
        data = User.parser.parse_args()
        user = UserModel.find_by_id(_id)

        if user:
            user.firstname = data['firstname']
            user.surname = data['surname']
            user.orga_id = data['orga_id']
            user.t_function_id = data['t_function_id']
            user.e_mail = data['e_mail']

        user.save_to_db()
        return {'User': 'User updated successfully'}

    def delete(self, _id):
        user = UserModel.find_by_id(_id)
        if user:
            user.delete_from_db()
        return {'user': 'User deleted'}


class UserRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('firstname',
                        type=str,
                        required=False,  # Warum war das hier auf true, wenn es optional ist?
                        help="This field is optional, but a real Name should be used ;)."
                        )
    parser.add_argument('e_mail',
                        type=str,
                        required=True,
                        help="ID field cannot be blank."
                        )
    parser.add_argument('password',
                        type=str,
                        required=True,
                        help="Please enter a password :)"
                        )
    parser.add_argument('orga_id',
                        type=int,
                        required=True,
                        help="This field is optional, but a real Name should be used ;)."
                        )
    parser.add_argument('t_function_id',
                        type=int,
                        required=False,
                        help="This field is optional, but a real Name should be used ;)."
                        )
    parser.add_argument('del_kz',
                        type=int,
                        required=True,
                        help="This field is optional, but a real Name should be used ;)."
                        )

    def post(self):
        data = UserRegister.parser.parse_args()

        password = data["password"]

        salt = uuid.uuid4().hex
        hashed_password = hashlib.sha512(password.encode(
            'utf-8') + salt.encode('utf-8')).hexdigest()

        data["password"] = hashed_password
        data["pw_salt"] = salt

        if UserModel.find_by_e_mail(data["e_mail"]):
            return {"message": "A user with that e_mail already exists"}, 400

        user = UserModel(**data)  # (data["e_mail"], data["password"])
        user.save_to_db()

        return {"message": "User created successfully."}, 201


class UserGET(Resource):
    def get(self, _id):
        user = UserModel.find_by_id(_id)
        my_list = []
        for x in user:
            my_list.append(dict(x))
            return my_list
        else:
            return {'user': 'User not found'}, 404


class Users(Resource):
    def get(self):
        users = UserModel.find_all_Users()
        my_list = []
        for x in users:
            my_list.append(dict(x))
        return my_list


class ChangePassword(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('password',
                        type=str,
                        required=True,
                        help="Please enter your password :)"
                        )

    def put(self, _id):
        data = ChangePassword.parser.parse_args()
        user = UserModel.find_by_id(_id)

        if user:
            user.password = data['password']

        user.save_to_db()
        return {'PW': 'Password updated successfully'}


# class Users(Resource):
    # def get(self):
        # return {'users': [user.json() for user in UserModel.query.all()]}

    # NOTIZEN

    # from dbfunctions.connect import *
# from flask import Blueprint, request
# from dbfunctions.connect import *
# import json
# import pandas as pd
# from flask_restful import Resource, reqparse


#  class DimopUser():

#     def __init__(self, _id, firstname, e_mail):
#         self._id = _id
#         self.firstename = firstname
#         self.e_mail = e_mail
#         self.password = password

 # @classmethod
    # def find_by_email(cls, e_mail):
        # Datenbankverbindung
        #connection = sqlite3.connect ('data.db')
     #   conn = connect_db()

      #  query_e_mail = ("SELECT user.e_mail" FROM user, conn)
        #df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.function, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id", conn)

        #result = cursor.execute(query, (username,))
       # row = result. fetchone()
        #    if row not None:
        #       user = cls(*row) #_id, firstname, e_mail, password (row[0], row[1], row[2], row[3])
        #  else:
        #     user< = None

        # return e_mail
# @getAllUser_bp.route('/getAllUser', methods=["GET"])
# def getAllUser():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

 #   conn = connect_db()

  #  df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.function, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id", conn)

    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}

    # print(df.head())
    # return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}

#     @classmethod
#     def find_by_id(cls, _id):
#         #Datenbankverbindung
#         #connection = sqlite3.connect ('data.db')
#         conn = connect_db()

#         query_e_mail = ("SELECT user._id" FROM user, conn)
#         #df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.function, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id", conn)

#         #result = cursor.execute(query, (username,))
#         row = result. fetchone()
#             if row not None:
#                 user = cls(*row) #_id, firstname, e_mail, password (row[0], row[1], row[2], row[3])
#             else:
#                 user = None

#             return _id #user?

# class UserRegister(Resource):


#     parser = reqparse.RequestParser()
#     parser.add_argument('e_email',
#         type=str
#         required=True,
#         help="This field cannot be blank"
#     )
#     parser.add_argument('password',
#         type=str
#         required=True,
#         help="This field cannot be blank"
#     )

# ‚
#     def post(self):
#         data = UserRegister.parser.parse_args()
#         #check duplicates
#         #if DimopUser.find_by_email(data['e_mail']):
#          #   return {"message": "A user with that username already exists"}, 400


#         # Datenbank Verbindung
#         conn = connect_db()
#         query = "INSERT INTO user VALUES(NULL, ?, ?)" #Null = Autoinkrement
#                 #df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.function, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id", conn)

#         #cursor.execute(query,(data['username'], data[password']))
#         #commit save to disk
#         #close

#         return {"message": "User created successfully."}, 201

#         pass
