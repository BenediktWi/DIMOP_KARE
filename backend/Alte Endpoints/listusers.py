from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

listusers_bp = Blueprint('listusers', __name__)

@listusers_bp.route('/getUsers', methods=["GET"])
def listusers():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    konsid = request.args.get('konsid')
    print(request.args.get('konsid'))

    df = pd.read_sql_query("SELECT user.* FROM perp LEFT JOIN user ON (perp.user_id = user.id) WHERE kons_id='"+ konsid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
