from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getReltyp_bp = Blueprint('getReltyp', __name__)

@getReltyp_bp.route('/getReltyp', methods=["GET"])
def getReltyp():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    df = pd.read_sql_query("SELECT * from t_reltyp", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
