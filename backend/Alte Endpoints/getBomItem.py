from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getBomItem_bp = Blueprint('getBomItem', __name__)

@getBomItem_bp.route('/getBomItem', methods=["GET"])
def getBomItem():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    mastid = request.args.get('mastid')
    print(request.args.get('mastid'))

    df = pd.read_sql_query("SELECT stpo.id, stpo.mara_id, stpo.pos, stpo.height_erp, stpo.width_erp, stpo.depth_erp, stpo.unit_erp, stpo.volume_cad, stpo.unit_cad, stpo.weight_ui, stpo.qr_relevant FROM stpo WHERE stpo.mast_id='"+ mastid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
