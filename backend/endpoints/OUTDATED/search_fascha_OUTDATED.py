from flask_restful import Resource, reqparse


class Search(Resource):
    # parser = reqparse.RequestParser()
    # parser.add_argument('t1',
    #                     type=str,
    #                     # required=True,
    #                     # help="This field cannot be blank."
    #                     )
    # parser.add_argument('t2',
    #                     type=int,
    #                     # required=True,
    #                     # help="This field cannot be blank."
    #                     )

    def get(self, criteria):

        if (criteria.lower() == "zugmodul"):
            return {
                "Zugmodul_MPa_trocken": {"min": 0, "max": 47400.0},
                "Zugmodul_MPa_konditioniert": {"min": 0, "max": 27400.0},
                "Zugmodul_Kriech_1h_MPa_trocken": {"min": 0, "max": 21300.0},
                "Zugmodul_Kriech_1h_MPa_konditioniert": {"min": 0, "max": 14200.0},
                "Zugmodul_Kriech_1000h_MPa_trocken": {"min": 0, "max": 18600.0},
                "Zugmodul_Kriech_1000h_MPa_konditioniert": {"min": 0, "max": 12000.0},
                "Zugmodul_Parallel_MPa_trocken": {"min": 0, "max": 107064.0},
                "Zugmodul_Parallel_MPa_konditioniert": {"min": 0, "max": 19000.0},
                "Zugmodul_Senkrecht_MPa_trocken": {"min": 0, "max": 55000.0},
                "Zugmodul_Senkrecht_MPa_konditioniert": {"min": 0, "max": 19000.0},
            }
        elif criteria.lower() == "bruchdehnung":
            return {
                "Bruchdehnung_trocken": {"min": 0.3, "max": 46447.0},
                "Bruchdehnung_konditioniert": {"min": 1.3, "max": 43.0},
                "Bruchdehnung_Nominell_trocken": {"min": 2.9, "max": 45931.0},
                "Bruchdehnung_Nominell_konditioniert": {"min": 5.5, "max": 50.0},
                "Bruchdehnung_TPE_trocken": {"min": 7.0, "max": 300.0},
                # "Bruchdehnung_TPE_konditioniert": {"min": 0, "max": 14},
                "Bruchdehnung_Parallel_trocken": {"min": 1.1, "max": 36924.0},
                "Bruchdehnung_Parallel_konditioniert": {"min": 2.3, "max": 2.3},
            }
        elif criteria.lower() == "bruchspannung":
            return {
                "Bruchspannung_MPa_trocken": {"min": 6.0, "max": 321.0},
                "Bruchspannung_MPa_konditioniert": {"min": 27.0, "max": 280.0},
                "Bruchspannung_TPE_MPa_trocken": {"min": 8.5, "max": 115.0},
                # "Bruchspannung_TPE_MPa_konditioniert": {"min": 0, "max": 12},
                "Bruchspannung_Parallel_MPa_trocken": {"min": 310.0, "max": 1750.0},
                "Bruchspannung_Parallel_MPa_konditioniert": {"min": 370.0, "max": 380.0},
                "Bruchspannung_Senkrecht_MPa_trocken": {"min": 17.4, "max": 750.0},
                "Bruchspannung_Senkrecht_MPa_konditioniert": {"min": 370.0, "max": 380.0},
            }
        elif criteria.lower() == "belastung":
            return {
                "Belastung_trocken": {"min": 1.2, "max": 21.6},
                # "Belastung_konditioniert": {"min": 0, "max": 10},
            }
        elif criteria.lower() == "temperatur":
            return {
                "Temperatur_trocken": {"min": 160.0, "max": 400.0},
                # "Temperatur_konditioniert": {"min": 0, "max": 10},
            }
        elif criteria.lower() == "dichte":
            return {
                "dichte_trocken": {"min": 700.0, "max": 3150.0},
                "dichte_konditioniert": {"min": 1000.0, "max": 1570.0},
            }
        elif criteria.lower() == "mvr":
            return {
                "MVR_trocken": {"min": 0.1, "max": 290.0},
                # "MVR_konditioniert": {"min": 0, "max": 10},
            }


class Results(Resource):

    # parser.add_argument('t1',
    #                     type=str,
    #                     # required=True,
    #                     # help="This field cannot be blank."
    #                     )
    # parser.add_argument('t2',
    #                     type=str
    #                     # required=True,
    #                     # help="This field cannot be blank."
    #
    # )
    print("sgeht 1")
    parser = reqparse.RequestParser()
    print("sgeht 2")
    parser.add_argument("id", type=int)
    parser.add_argument("mat_desc", type=str)
    parser.add_argument("mat_int_desc", type=str)
    parser.add_argument("t_fam_id", type=str)
    parser.add_argument("campus_fam", type=str)
    parser.add_argument("t_mara_art_id", type=str)
    parser.add_argument("upload_kind", type=str)
    parser.add_argument("created_at", type=str)
    parser.add_argument("updated_at", type=str)
    parser.add_argument("unit", type=str)
    parser.add_argument("del_kz", type=str)
    parser.add_argument("producer", type=str)
    parser.add_argument("Verarbeitungsmethode", type=str)
    parser.add_argument("dichte_trocken", type=float, action="append")
    parser.add_argument("dichte_konditioniert", type=float, action="append")
    parser.add_argument("Belastung_trocken", type=float, action="append")
    parser.add_argument("Belastung_konditioniert", type=float, action="append")
    parser.add_argument("Temperatur_trocken", type=float, action="append")
    parser.add_argument("Temperatur_konditioniert",
                        type=float, action="append")
    parser.add_argument("MVR_trocken", type=float, action="append")
    parser.add_argument("MVR_konditioniert", type=float, action="append")
    parser.add_argument("Bruchdehnung_trocken", type=float, action="append")
    parser.add_argument("Bruchdehnung_konditioniert",
                        type=float, action="append")
    parser.add_argument("Bruchdehnung_Nominell_trocken",
                        type=float, action="append")
    parser.add_argument("Bruchdehnung_Nominell_konditioniert",
                        type=float, action="append")
    parser.add_argument("Bruchdehnung_TPE_trocken",
                        type=float, action="append")
    parser.add_argument("Bruchdehnung_TPE_konditioniert",
                        type=float, action="append")
    parser.add_argument("Bruchdehnung_Parallel_trocken",
                        type=float, action="append")
    parser.add_argument("Bruchdehnung_Parallel_konditioniert",
                        type=float, action="append")
    parser.add_argument("Bruchspannung_MPa_trocken",
                        type=float, action="append")
    parser.add_argument("Bruchspannung_MPa_konditioniert",
                        type=float, action="append")
    parser.add_argument("Bruchspannung_TPE_MPa_trocken",
                        type=float, action="append")
    parser.add_argument("Bruchspannung_TPE_MPa_konditioniert",
                        type=float, action="append")
    parser.add_argument("Bruchspannung_Parallel_MPa_trocken",
                        type=float, action="append")
    parser.add_argument(
        "Bruchspannung_Parallel_MPa_konditioniert", type=float, action="append")
    parser.add_argument("Bruchspannung_Senkrecht_MPa_trocken",
                        type=float, action="append")
    parser.add_argument(
        "Bruchspannung_Senkrecht_MPa_konditioniert", type=float, action="append")
    parser.add_argument("Zugmodul_MPa_trocken", type=float, action="append")
    parser.add_argument("Zugmodul_MPa_konditioniert",
                        type=float, action="append")
    parser.add_argument("Zugmodul_Kriech_1h_MPa_trocken",
                        type=float, action="append")
    parser.add_argument("Zugmodul_Kriech_1h_MPa_konditioniert",
                        type=float, action="append")
    parser.add_argument("Zugmodul_Kriech_1000h_MPa_trocken",
                        type=float, action="append")
    parser.add_argument(
        "Zugmodul_Kriech_1000h_MPa_konditioniert", type=float, action="append")
    parser.add_argument("Zugmodul_Parallel_MPa_trocken",
                        type=float, action="append")
    parser.add_argument("Zugmodul_Parallel_MPa_konditioniert",
                        type=float, action="append")
    parser.add_argument("Zugmodul_Senkrecht_MPa_trocken",
                        type=float, action="append")
    parser.add_argument("Zugmodul_Senkrecht_MPa_konditioniert",
                        type=float, action="append")

    parser.add_argument("newMaterial", type=dict)

    def post(self):
        print("sgeht 3")
        args = self.parser.parse_args()
        print("sgeht 4")
        print("{}   ----    {}  ----    {}".format(args['newMaterial']['id'], args['newMaterial']
                                                   ['mat_desc'], args['newMaterial']['campus_fam']))

    def get(self):
        args = self.parser.parse_args()
        args = {arg: args[arg] for arg in args if (
            args[arg] != '' and args[arg] != None)}
        print(args)

        return [
            {
                "id": "1",
                "mat_desc": "ACRYMID\u00ae TT50",
                "mat_int_desc": None,
                "t_fam_id": 43.0,
                "campus_fam": "Techn-Sonst",
                "t_mara_art_id": 1.0,
                "upload_kind": "DIMOP",
                "created_at": "2020-06-13 00:00:00",
                "updated_at": "2020-07-29 12:52:12",
                "unit": "kg",
                "del_kz": 0,
                "producer": "Evonik Industries AG",
                "Verarbeitungsmethode": "Spritzgie\u00dfen",
                "dichte_trocken": 1210.0,
                "dichte_konditioniert": None,
                "Belastung_trocken": 10.0,
                "Belastung_konditioniert": None,
                "Temperatur_trocken": 260.0,
                "Temperatur_konditioniert": None,
                "MVR_trocken": 5.0,
                "MVR_konditioniert": None,
                "Bruchdehnung_trocken": 3.0,
                "Bruchdehnung_konditioniert": None,
                "Bruchdehnung_Nominell_trocken": None,
                "Bruchdehnung_Nominell_konditioniert": None,
                "Bruchdehnung_TPE_trocken": None,
                "Bruchdehnung_TPE_konditioniert": None,
                "Bruchdehnung_Parallel_trocken": None,
                "Bruchdehnung_Parallel_konditioniert": None,
                "Bruchspannung_MPa_trocken": 80.0,
                "Bruchspannung_MPa_konditioniert": None,
                "Bruchspannung_TPE_MPa_trocken": None,
                "Bruchspannung_TPE_MPa_konditioniert": None,
                "Bruchspannung_Parallel_MPa_trocken": None,
                "Bruchspannung_Parallel_MPa_konditioniert": None,
                "Bruchspannung_Senkrecht_MPa_trocken": None,
                "Bruchspannung_Senkrecht_MPa_konditioniert": None,
                "Zugmodul_MPa_trocken": 4000.0,
                "Zugmodul_MPa_konditioniert": None,
                "Zugmodul_Kriech_1h_MPa_trocken": None,
                "Zugmodul_Kriech_1h_MPa_konditioniert": None,
                "Zugmodul_Kriech_1000h_MPa_trocken": None,
                "Zugmodul_Kriech_1000h_MPa_konditioniert": None,
                "Zugmodul_Parallel_MPa_trocken": None,
                "Zugmodul_Parallel_MPa_konditioniert": None,
                "Zugmodul_Senkrecht_MPa_trocken": None,
                "Zugmodul_Senkrecht_MPa_konditioniert": None
            }
        ]
