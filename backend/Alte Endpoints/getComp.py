from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getComp_bp = Blueprint('getComp', __name__)

@getComp_bp.route('/getComp', methods=["GET"])
def getComp():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    parentid = request.args.get('parentid')
    print(request.args.get('parentid'))

    df = pd.read_sql_query("SELECT comp.id, comp.t_fam_id_parent, F1.fam AS parent_fam, comp.t_fam_id_child, F2.fam AS child_fam, t_origin.type_desc, comp.comp_value, user.firstname, user.surname FROM comp LEFT JOIN user ON comp.user_id=user.id LEFT JOIN t_origin ON comp.t_origin_id=t_origin.id LEFT JOIN t_fam AS F1 ON comp.t_fam_id_parent=F1.id LEFT JOIN t_fam AS F2 ON comp.t_fam_id_child=F2.id WHERE comp.t_fam_id_parent='"+ parentid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
