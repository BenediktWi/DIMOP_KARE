from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getAllUser_bp = Blueprint('getAllUser', __name__)

@getAllUser_bp.route('/getAllUser', methods=["GET"])
def getAllUser():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    df = pd.read_sql_query("SELECT user.id, user.firstname, user.surname, user.e_mail, orga.orga_name, t_function.function, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id", conn)

    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'} 