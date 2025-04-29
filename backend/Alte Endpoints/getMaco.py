from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getMaco_bp = Blueprint('getMaco', __name__)

@getMaco_bp.route('/getMaco', methods=["GET"])
def getMaco():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    stpoid = request.args.get('stpoid')
    print(request.args.get('stpoid'))

    df = pd.read_sql_query("SELECT maco.id, maco.stpo_id_comp_a, M1.mat_desc AS mat_desc_comp_a, S1.pos AS pos_comp_a, maco.stpo_id_comp_b, M2.mat_desc AS mat_desc_comp_b, S2.pos AS pos_comp_b, t_reltyp.type, t_reltyp.kind, maco.mass_product FROM maco LEFT JOIN t_reltyp on maco.t_reltyp_id=t_reltyp.id LEFT JOIN stpo AS S1 ON maco.stpo_id_comp_a=S1.id LEFT JOIN stpo AS S2 ON maco.stpo_id_comp_b=S2.id LEFT JOIN mara AS M1 ON S1.mara_id=M1.id lEFT JOIN mara AS M2 ON S2.mara_id=M2.id where S1.id='"+ stpoid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
