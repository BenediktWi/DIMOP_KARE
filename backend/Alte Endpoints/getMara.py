from flask import Blueprint, request
from dbfunctions.connect import *
import json
import pandas as pd

getMara_bp = Blueprint('getMara', __name__)

@getMara_bp.route('/getMara', methods=["GET"])
def getMara():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = connect_db()

    userid = request.args.get('userid')
    print(request.args.get('userid'))

    df = pd.read_sql_query("SELECT mara.id, mara.mara_nr, mara.mat_desc, mara.mat_int_desc, mara.mat_rw, mara.t_fam_id, t_fam.fam_dimop_desc, mara.campus_fam, mara.t_mara_art_id, t_mara_art.art, mara.upload_kind, mara.created_at, mara.updated_at, mara.dichte, mara.unit, mara.del_kz, mara.producer, mara.Verarbeitungsmethode, mara.Belastung, mara.Temperatur, mara.MVR, mara.Bruchdehnung, mara.Bruchdehnung_Nominell, mara.Bruchdehnung_TPE, mara.Bruchdehnung_Parallel, mara.Bruchdehnung_Senkrecht, mara.Bruchspannung_MPa, mara.Bruchspannung_TPE_MPa, mara.Bruchspannung_Parallel_MPa, mara.Bruchspannung_Senkrecht_MPa, mara.Zugmodul_MPa, mara.Zugmodul_Kriech_1h_MPa, mara.Zugmodul_Kriech_1000h_MPa, mara.Zugmodul_Parallel_MPa, mara.Zugmodul_Senkrecht_MPa from mara LEFT JOIN t_fam ON mara.t_fam_id=t_fam.id LEFT JOIN t_mara_art ON mara.t_mara_art_id=t_mara_art.id where mara.user_id='"+ userid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df.head())
    return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}
