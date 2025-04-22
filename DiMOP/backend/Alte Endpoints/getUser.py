from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getUser_bp = Blueprint('getUser', __name__)

@getUser_bp.route('/getUser', methods=["GET"])
def getUser():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    email = request.args.get('email')
    print(request.args.get('email'))

    df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.`function`, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id where user.e_mail='"+ email + "'", conn)

    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}