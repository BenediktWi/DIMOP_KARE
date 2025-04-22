from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getBomAl_bp = Blueprint('getBomAl', __name__)

@getBomAl_bp.route('/getBomAl', methods=["GET"])
def getBomAl():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    konsid = request.args.get('konsid')
    print(request.args.get('konsid'))

    df = pd.read_sql_query("SELECT mast.id, mast.bom_nr, mast.bom_al, mast.bom_al_desc, mara.mara_nr, mara.mat_desc, mast.fav, user.firstname, user.surname, mast.cad_nr, mast.created_at, mast.updated_at FROM mast LEFT JOIN mara ON mast.mara_id=mara.id LEFT JOIN user ON mast.user_id=user.id WHERE mast.kons_id='"+ konsid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
