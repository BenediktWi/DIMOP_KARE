from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

deletePersKons_bp = Blueprint('deletePersKons', __name__)

@deletePersKons_bp.route('/deletePersKons', methods=["DELETE", "GET"])
def deletePersKons():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    konsid = request.args.get('konsid')
    userid = request.args.get('userid')
    print(request.args.get('konsid'))

    df = pd.read_sql_query("DELETE from perp WHERE kons_id='"+ konsid + "' and user_id='"+userid +"'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
