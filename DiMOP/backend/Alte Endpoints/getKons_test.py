from flask import Blueprint, request, jsonify
from dbfunctions.connect_test import *
import json
import pandas as pd

getKons_test_bp = Blueprint('getKons_test', __name__)

@getKons_test_bp.route('/getKons_test', methods=["GET"])
def getKons_test():
    # Bekommt per POST Protokoll, Server, Port, Benutzername, Passwort, Datenbanktyp
    # Speichert das in lokaler sqlite datenbank als dict ab

    # {'IPPort': '4124', 'IPAddress': '12', 'protocol': 'fsdgfd', 'username': 'dfhg', 'password': 'dfgh'}
    # print(request.json)

    conn = db

    userid = request.args.get('userid')
    print(request.args.get('userid'))

    df = cursor.execute("SELECT kons.* FROM perp LEFT JOIN kons ON perp.kons_id=kons.id WHERE user_id='"+ userid + "'", conn)


    # Bei erfolg http status 200 zurückgeben an frontend
    #ret = {"id_database_severs": database_server["id_database_severs"]}
    print(df)
    return json.dumps(df)
    #return jsonify(df)
    #return df.to_json(orient='records'), 200, {'ContentType': 'application/json'}


#________
# import json
# file = open ('Dateiname') # json laden
# j_array = json.load(file) # json an Variable übergeben
# for i in j_array:

# print (json.dumps(j_array, indent=4)) # json in string dekodiert