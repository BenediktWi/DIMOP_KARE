from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getOrga_bp = Blueprint('getOrga', __name__)

@getOrga_bp.route('/getOrga', methods=["GET"])
def getOrga():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    df = pd.read_sql_query("SELECT orga.id, orga.orga_nr, orga.orga_name, t_branch.branch_name FROM orga LEFT JOIN t_branch ON orga.t_branch_id=t_branch.id", conn)

    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}