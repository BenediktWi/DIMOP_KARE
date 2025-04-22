from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

putKons_bp = Blueprint('putKons', __name__)

@putKons_bp.route('/putKons', methods=["PUT", "GET"])
def putKons():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    konsid = request.args.get('konsid')
    data = request.json
    print(request.args.get('konsid'))

    df = pd.read_sql_query("Update kons set kons_title='"+ data["kons_title"]+"', kons_desc='"+ data["kons_desc"]+"', orga_id='"+ data["orga_id"]+"', mara_id='"+ data["mara_id"]+"', del_kz='"+ data["del_kz"]+"' where id='"+ konsid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
