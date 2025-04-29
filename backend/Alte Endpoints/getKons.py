from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getKons_bp = Blueprint('getKons', __name__)

@getKons_bp.route('/getKons', methods=["GET"])
def getKons():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    userid = request.args.get('userid')
    print(request.args.get('userid'))

    df = pd.read_sql_query("SELECT kons.id, kons.kons_title, kons.kons_desc, orga.orga_name, mara.mara_nr, mara.mat_desc, kons.created_at, kons.updated_at, kons.del_kz FROM kons LEFT JOIN mara ON kons.mara_id=mara.id LEFT join orga ON kons.orga_id=orga.id LEFT JOIN perp on perp.kons_id=kons.id LEFT JOIN user on perp.user_id=user.id WHERE user.id='"+ userid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
