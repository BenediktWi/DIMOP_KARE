from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

postKons_bp = Blueprint('postKons', __name__)

@postKons_bp.route('/postKons', methods=["POST", "GET"])
def postKons():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    #{'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    #print(request.json)'

    conn = connect_db()
    data=request.json
    df = pd.read_sql_query("insert into kons (kons_title, kons_desc, orga_id, mara_id, del_kz) values ('"+ data["kons_title"]+"','"+ data["kons_desc"]+"', '"+ data["orga_id"]+"', '"+ data["mara_id"]+"', '"+ data["del_kz"]+"')",conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
