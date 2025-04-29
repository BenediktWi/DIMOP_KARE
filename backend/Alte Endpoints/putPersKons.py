from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

putPersKons_bp = Blueprint('putPersKons', __name__)

@putPersKons_bp.route('/putPersKons', methods=["PUT", "GET"])
def putPersKons():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    konsid = request.args.get('konsid')
    userid = request.args.get('userid')
    data = request.json
    print(request.args.get('konsid'))

    df = pd.read_sql_query("Update perp set perp.auth_read='"+ data["auth_read"]+"', perp.auth_write='"+ data["auth_write"]+"', perp.auth_delete='"+ data["auth_delete"]+"' where kons_id='"+ konsid + "' and user_id='"+userid +"'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
