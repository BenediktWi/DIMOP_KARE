from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getBom_bp = Blueprint('getBom', __name__)

@getBom_bp.route('/getBom', methods=["GET"])
def getBom():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    konsid = request.args.get('konsid')
    print(request.args.get('konsid'))

    df = pd.read_sql_query("SELECT mara.id, mara.mara_nr, mara.mat_desc, mast.bom_al, mast.user_id, user.firstname, user.surname, mast.created_at, mast.updated_at, mast.cad_nr FROM mast LEFT JOIN mara ON mast.mara_id=mara.id LEFT JOIN user ON mast.user_id=user.id WHERE kons_id='"+ konsid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
