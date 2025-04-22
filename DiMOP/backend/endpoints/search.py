"""
author: topr
last updated: 25.05.2021
currently used: yes
description: used to execute material search
"""

from flask_restful import Resource, reqparse
import pandas as pd
import json
from dbfunctions.connect import connect_db


class Search(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('mat_desc',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('campus_fam',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('producer',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('verarbeitungsmethode',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('zugmodul',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('zugmodul_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('zugmodul_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bruchspannung',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bruchspannung_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bruchspannung_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bruchdehnung',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bruchdehnung_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('bruchdehnung_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mvr',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mvr_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('mvr_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('dichte',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('dichte_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('dichte_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('belastung',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('belastung_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('belastung_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('temperatur',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('temperatur_min',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('temperatur_max',
                        type=float,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = Search.parser.parse_args()

        data_list = []

        for key in data:
            data_list.append([key, data[key]])

        df = pd.DataFrame(data_list, columns=['key', 'value'])

        if(df.loc[df["key"] == "mat_desc"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(["mat_desc"])].index)

        if(df.loc[df["key"] == "campus_fam"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(["campus_fam"])].index)

        if(df.loc[df["key"] == "producer"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(["producer"])].index)

        if(df.loc[df["key"] == "verarbeitungsmethode"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["verarbeitungsmethode"])].index)

        if(df.loc[df["key"] == "zugmodul"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["zugmodul", "zugmodul_min", "zugmodul_max"])].index)

        if(df.loc[df["key"] == "bruchspannung"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["bruchspannung", "bruchspannung_min", "bruchspannung_max"])].index)

        if(df.loc[df["key"] == "bruchdehnung"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["bruchdehnung", "bruchdehnung_min", "bruchdehnung_max"])].index)

        if(df.loc[df["key"] == "mvr"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["mvr", "mvr_min", "mvr_max"])].index)

        if(df.loc[df["key"] == "dichte"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["dichte", "dichte_min", "dichte_max"])].index)

        if(df.loc[df["key"] == "belastung"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["belastung", "belastung_min", "belastung_max"])].index)

        if(df.loc[df["key"] == "temperatur"]["value"].tolist()[0] == ""):
            df = df.drop(df.loc[df["key"].isin(
                ["temperatur", "temperatur_min", "temperatur_max"])].index)

        df = df.reset_index()

        db = connect_db()

        query = "SELECT * FROM plast"

        print(df)

        for i in range(0, df.shape[0]):

            key = df["key"][i]
            value = df["value"][i]

            if(query == "SELECT * FROM plast"):
                if(key in ["mat_desc", "campus_fam", "producer", "verarbeitungsmethode"]):
                    query = f"{query} WHERE {key}='{value}'"

                elif(key in ["zugmodul", "bruchspannung", "bruchdehnung", "mvr",
                             "dichte", "belastung", "temperatur"]):
                    minimum = df.loc[df["key"] == f"{key}_min"]["value"].tolist()[
                        0]
                    maximum = df.loc[df["key"] == f"{key}_max"]["value"].tolist()[
                        0]
                    query = f"{query} WHERE {value} BETWEEN {minimum} AND {maximum}"

            else:
                if(key in ["mat_desc", "campus_fam", "producer", "verarbeitungsmethode"]):
                    query = f"{query} AND {key}='{value}'"

                elif(key in ["zugmodul", "bruchspannung", "bruchdehnung", "mvr",
                             "dichte", "belastung", "temperatur"]):
                    minimum = df.loc[df["key"] == f"{key}_min"]["value"].tolist()[
                        0]
                    maximum = df.loc[df["key"] == f"{key}_max"]["value"].tolist()[
                        0]
                    query = f"{query} AND {value} BETWEEN {minimum} AND {maximum}"

        print(query)

        result = pd.read_sql_query(query, db)

        # Fill nans to display data correctly
        # Further data engineering could be useful later
        for col in result.columns:
            if(result[col].dtype == "float64"):
                result[col] = result[col].fillna(0)
            elif(result[col].dtype == "object"):
                result[col] = result[col].fillna("")

        print(result.shape)

        result = result.loc[result["del_kz"] == 1]

        result_json = result.to_dict(orient="records")

        return result_json
