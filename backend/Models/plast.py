from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text


class PlastModel(db.Model):
    __tablename__ = 'plast'

    id = db.Column(db.Integer, primary_key=True)
    mat_desc = db.Column(db.String)
    mat_int_desc = db.Column(db.String)
    t_fam_id = db.Column(db.Integer)
    campus_fam = db.Column(db.String)
    t_mara_art_id = db.Column(db.Integer)
    upload_kind = db.Column(db.String)
    created_at = datetime
    updated_at = datetime
    dichte_trocken = db.Column(db.Float)
    dichte_konditioniert = db.Column(db.Float)
    unit = db.Column(db.String)
    del_kz = db.Column(db.Boolean)
    producer = db.Column(db.String)
    Verarbeitungsmethode = db.Column(db.String)
    Belastung_trocken = db.Column(db.Float)
    Belastung_konditioniert = db.Column(db.Float)
    Temperatur_trocken_trocken = db.Column(db.Float)
    Temperatur_trocken_konditioniert = db.Column(db.Float)
    MVR_trocken_trocken = db.Column(db.Float)
    MVR_trocken_konditioniert = db.Column(db.Float)
    Bruchdehnung_trocken = db.Column(db.Float)
    Bruchdehnung_konditioniert = db.Column(db.Float)
    Bruchdehnung_Nominell_trocken = db.Column(db.Float)
    Bruchdehnung_Nominell_konditioniert = db.Column(db.Float)
    Bruchdehnung_TPE_trocken = db.Column(db.Float)
    Bruchdehnung_TPE_konditioniert = db.Column(db.Float)
    Bruchdehnung_Parallel_trocken = db.Column(db.Float)
    Bruchdehnung_Parallel_konditioniert = db.Column(db.Float)
    Bruchspannung_MPa_trocken = db.Column(db.Float)
    Bruchspannung_MPa_konditioniert = db.Column(db.Float)
    Bruchspannung_TPE_MPa_trocken = db.Column(db.Float)
    Bruchspannung_TPE_MPa_konditioniert = db.Column(db.Float)
    Bruchspannung_Parallel_MPa_trocken = db.Column(db.Float)
    Bruchspannung_Parallel_MPa_konditioniert = db.Column(db.Float)
    Bruchspannung_Senkrecht_Mpa_trocken = db.Column(db.Float)
    Bruchspannung_Senkrecht_Mpa_konditioniert = db.Column(db.Float)
    Zugmodul_MPa_trocken = db.Column(db.Float)
    Zugmodul_MPa_konditioniert = db.Column(db.Float)
    Zugmodul_Kriech_1h_MPa_trocken = db.Column(db.Float)
    Zugmodul_Kriech_1h_MPa_konditioniert = db.Column(db.Float)
    Zugmodul_Kriech_1000h_MPa_trocken = db.Column(db.Float)
    Zugmodul_Kriech_1000h_MPa_konditioniert = db.Column(db.Float)
    Zugmodul_Parallel_MPa_trocken = db.Column(db.Float)
    Zugmodul_Parallel_MPa_konditioniert = db.Column(db.Float)
    Zugmodul_Senkrecht_MPa_trocken = db.Column(db.Float)
    Zugmodul_Senkrecht_MPa_konditioniert = db.Column(db.Float)

    def __init__(self, mat_desc, t_fam_id, dichte_trocken, dichte_konditioniert, mat_int_desc=None,  campus_fam=None, t_mara_art_id=None, upload_kind=None, created_at=None, updated_at=None, unit=None, del_kz=None, producer=None, Verarbeitungsmethode=None, Belastung_trocken=None, Belastung_konditioniert=None, Temperatur_trocken=None, Temperatur_konditioniert=None, MVR_trocken=None, MVR_konditioniert=None, Bruchdehnung_trocken=None, Bruchdehnung_konditioniert=None, Bruchdehnung_Nominell_trocken=None, Bruchdehnung_Nominell_konditioniert=None, Bruchdehnung_TPE_trocken=None, Bruchdehnung_TPE_konditioniert=None, Bruchdehnung_Parallel_trocken=None, Bruchdehnung_Parallel_konditioniert=None, Bruchspannung_MPa_trocken=None, Bruchspannung_MPa_konditioniert=None, Bruchspannung_TPE_MPa_trocken=None, Bruchspannung_TPE_MPa_konditioniert=None, Bruchspannung_Parallel_MPa_trocken=None, Bruchspannung_Parallel_MPa_konditioniert=None, Bruchspannung_Senkrecht_Mpa_trocken=None, Bruchspannung_Senkrecht_Mpa_konditioniert=None, Zugmodul_MPa_trocken=None, Zugmodul_MPa_konditioniert=None, Zugmodul_Kriech_1h_MPa_trocken=None, Zugmodul_Kriech_1h_MPa_konditioniert=None, Zugmodul_Kriech_1000h_MPa_trocken=None, Zugmodul_Kriech_1000h_MPa_konditioniert=None, Zugmodul_Parallel_MPa_trocken=None, Zugmodul_Parallel_MPa_konditioniert=None, Zugmodul_Senkrecht_MPa_trocken=None, Zugmodul_Senkrecht_MPa_konditioniert=None):
        self.mat_desc = mat_desc
        self.mat_int_desc = mat_int_desc
        self.t_fam_id = t_fam_id
        self.campus_fam = campus_fam
        self.t_mara_art_id = t_mara_art_id
        self.upload_kind = upload_kind
        self.created_at = created_at
        self.updated_at = updated_at
        self.dichte_trocken = dichte_trocken
        self.dichte_konditioniert = dichte_konditioniert
        self.unit = unit
        self.del_kz = del_kz
        self.producer = producer
        self.Verarbeitungsmethode = Verarbeitungsmethode
        self.Belastung_trocken = Belastung_trocken
        self.Belastung_konditioniert = Belastung_konditioniert
        self.Temperatur_trocken = Temperatur_trocken
        self.Temperatur_konditioniert = Temperatur_konditioniert
        self.MVR_trocken = MVR_trocken
        self.MVR_konditioniert = MVR_konditioniert
        self.Bruchdehnung_trocken = Bruchdehnung_trocken
        self.Bruchdehnung_konditioniert = Bruchdehnung_konditioniert
        self.Bruchdehnung_Nominell_trocken = Bruchdehnung_Nominell_trocken
        self.Bruchdehnung_Nominell_konditioniert = Bruchdehnung_Nominell_konditioniert
        self.Bruchdehnung_TPE_trocken = Bruchdehnung_TPE_trocken
        self.Bruchdehnung_TPE_konditioniert = Bruchdehnung_TPE_konditioniert
        self.Bruchdehnung_Parallel_trocken = Bruchdehnung_Parallel_trocken
        self.Bruchdehnung_Parallel_konditioniert = Bruchdehnung_Parallel_konditioniert
        self.Bruchspannung_MPa_trocken = Bruchspannung_MPa_trocken
        self.Bruchspannung_MPa_konditioniert = Bruchspannung_MPa_konditioniert
        self.Bruchspannung_TPE_MPa_trocken = Bruchspannung_TPE_MPa_trocken
        self.Bruchspannung_TPE_MPa_konditioniert = Bruchspannung_TPE_MPa_konditioniert
        self.Bruchspannung_Parallel_MPa_trocken = Bruchspannung_Parallel_MPa_trocken
        self.Bruchspannung_Parallel_MPa_konditioniert = Bruchspannung_Parallel_MPa_konditioniert
        self.Bruchspannung_Senkrecht_Mpa_trocken = Bruchspannung_Senkrecht_Mpa_trocken
        self.Bruchspannung_Senkrecht_Mpa_konditioniert = Bruchspannung_Senkrecht_Mpa_konditioniert
        self.Zugmodul_MPa_trocken = Zugmodul_MPa_trocken
        self.Zugmodul_MPa_konditioniert = Zugmodul_MPa_konditioniert
        self.Zugmodul_Kriech_1h_MPa_trocken = Zugmodul_Kriech_1h_MPa_trocken
        self.Zugmodul_Kriech_1h_MPa_konditioniert = Zugmodul_Kriech_1h_MPa_konditioniert
        self.Zugmodul_Kriech_1000h_MPa_trocken = Zugmodul_Kriech_1000h_MPa_trocken
        self.Zugmodul_Kriech_1000h_MPa_konditioniert = Zugmodul_Kriech_1000h_MPa_konditioniert
        self.Zugmodul_Parallel_MPa_trocken = Zugmodul_Parallel_MPa_trocken
        self.Zugmodul_Parallel_MPa_konditioniert = Zugmodul_Parallel_MPa_konditioniert
        self.Zugmodul_Senkrecht_MPa_trocken = Zugmodul_Senkrecht_MPa_trocken
        self.Zugmodul_Senkrecht_MPa_konditioniert = Zugmodul_Senkrecht_MPa_konditioniert

    def json(self):
        return {'id': self.id, 'mat_desc': self.mat_desc, 'mat_int_desc': self.mat_int_desc,  't_fam_id': self.t_fam_id, 'campus_fam': self.campus_fam, 't_mara_art_id': self.t_mara_art_id, 'upload_kind': self.upload_kind, 'dichte_trocken': self.dichte_trocken, 'dichte_konditioniert': self.dichte_konditioniert, 'unit': self.unit, 'del_kz': self.del_kz, 'producer': self.producer, 'Verarbeitungsmethode': self.Verarbeitungsmethode, 'Belastung_trocken': self.Belastung_trocken, 'Belastung_konditioniert': self.Belastung_konditioniert, 'Temperatur_trocken': self.Temperatur_trocken, 'Temperatur_konditioniert': self.Temperatur_koni, 'MVR_trocken': self.MVR_trocken, 'MVR_konditioniert': self.MVR_konditioniert, 'Bruchdehnung_trocken': self.Bruchdehnung_trocken, 'Bruchdehnung_konditioniert': self.Bruchdehnung_konditioniert, 'Bruchdehnung_Nominell_trocken': self.Bruchdehnung_Nominell_trocken, 'Bruchdehnung_Nominell_konditioniert': self.Bruchdehnung_Nominell_konditioniert, 'Bruchdehnung_TPE_trocken': self.Bruchdehnung_TPE_trocken, 'Bruchdehnung_TPE_konditioniert': self.Bruchdehnung_TPE_konditioniert, 'Bruchdehnung_Senkrecht_trocken': self.Bruchdehnung_Senkrecht_trocken, 'Bruchdehnung_Senkrecht_konditioniert': self.Bruchdehnung_Senkrecht_konditioniert, 'Bruchdehnung_Parallel_trocken': self.Bruchdehnung_Parallel_trocken, 'Bruchdehnung_Parallel_konditioniert': self.Bruchdehnung_Parallel_konditioniert, 'Bruchspannung_MPa_trocken': self.Bruchspannung_MPa_trocken, 'Bruchspannung_MPa_konditioniert': self.Bruchspannung_MPa_konditioniert, 'Bruchspannung_TPE_MPa_trocken': self.Bruchspannung_TPE_MPa_trocken, 'Bruchspannung_TPE_MPa_konditioniert': self.Bruchspannung_TPE_MPa_konditioniert, 'Bruchspannung_Parallel_MPa_trocken': self.Bruchspannung_Parallel_MPa_trocken, 'Bruchspannung_Parallel_MPa_konditioniert': self.Bruchspannung_Parallel_MPa_konditioniert, 'Bruchspannung_Senkrecht_Mpa_trocken': self.Bruchspannung_Senkrecht_Mpa_trocken, 'Bruchspannung_Senkrecht_Mpa_konditioniert': self.Bruchspannung_Senkrecht_Mpa_konditioniert, 'Zugmodul_MPa_trocken': self.Zugmodul_MPa_trocken, 'Zugmodul_MPa_konditioniert': self.Zugmodul_MPa_konditioniert, 'Zugmodul_Kriech_1h_MPa_trocken': self.Zugmodul_Kriech_1h_MPa_trocken, 'Zugmodul_Kriech_1h_MPa_konditioniert': self.Zugmodul_Kriech_1h_MPa_konditioniert, 'Zugmodul_Kriech_1000h_MPa_trocken': self.Zugmodul_Kriech_1000h_MPa_trocken, 'Zugmodul_Kriech_1000h_MPa_konditioniert': self.Zugmodul_Kriech_1000h_MPa_konditioniert, 'Zugmodul_Parallel_MPa_trocken': self.Zugmodul_Parallel_MPa_trocken, 'Zugmodul_Parallel_MPa_konditioniert': self.Zugmodul_Parallel_MPa_konditioniert, 'Zugmodul_Senkrecht_MPa_trocken': self.Zugmodul_Senkrecht_MPa_trocken, 'Zugmodul_Senkrecht_MPa_konditioniert': self.Zugmodul_Senkrecht_MPa_konditioniert}

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    @classmethod
    def find_all(cls):
        sql = text("SELECT * FROM plast")
        result = db.session.execute(sql)
        return result.fetchall()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
