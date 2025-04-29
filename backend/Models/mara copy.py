from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text

class MaraModel(db.Model):
    __tablename__ = 'mara'

    id = db.Column(db.Integer, primary_key=True)
    mara_nr = db.Column(db.String)
    mat_desc = db.Column(db.String)
    mat_int_desc = db.Column(db.String)
    mat_rw = db.Column(db.Float)
    t_fam_id = db.Column(db.Integer)
    campus_fam = db.Column(db.String)
    user_id = db.Column(db.Integer)
    t_mara_art_id = db.Column(db.Integer)
    upload_kind = db.Column(db.String)
    created_at = datetime
    updated_at = datetime
    dichte = db.Column(db.String)
    unit = db.Column(db.String)
    del_kz = db.Column(db.Boolean)
    producer = db.Column(db.String)
    Verarbeitungsmethode = db.Column(db.String)
    Belastung = db.Column(db.String)
    Temperatur = db.Column(db.String)
    MVR = db.Column(db.String)
    Bruchdehnung = db.Column(db.String)
    Bruchdehnung_Nominell = db.Column(db.String)
    Bruchdehnung_TPE = db.Column(db.String)
    Bruchdehnung_Senkrecht = db.Column(db.String)
    Bruchdehnung_Parallel = db.Column(db.String)
    Bruchspannung_MPa = db.Column(db.String)
    Bruchspannung_TPE_MPa = db.Column(db.String)
    Bruchspannung_Parallel_MPa = db.Column(db.String)
    Bruchspannung_Senkrecht_Mpa = db.Column(db.String)
    Zugmodul_MPa = db.Column(db.String)
    Zugmodul_Kriech_1h_MPa = db.Column(db.String)
    Zugmodul_Kriech_1000h_MPa = db.Column(db.String)
    Zugmodul_Parallel_MPa = db.Column(db.String)
    Zugmodul_Senkrecht_MPa = db.Column(db.String)

    def __init__(self, mara_nr, mat_desc, t_fam_id, dichte, mat_int_desc=None,mat_rw=None, campus_fam=None, user_id=None, t_mara_art_id=None, upload_kind=None, created_at=None, updated_at=None, unit=None,del_kz=None,producer=None,Verarbeitungsmethode=None, Belastung=None, Temperatur=None, MVR=None, Bruchdehnung=None, Bruchdehnung_Nominell=None, Bruchdehnung_TPE=None, Bruchdehnung_Senkrecht=None, Bruchdehnung_Parallel=None, Bruchspannung_MPa=None, Bruchspannung_TPE_MPa=None, Bruchspannung_Parallel_MPa=None, Bruchspannung_Senkrecht_Mpa=None, Zugmodul_MPa=None, Zugmodul_Kriech_1h_MPa=None, Zugmodul_Kriech_1000h_MPa=None, Zugmodul_Parallel_MPa=None, Zugmodul_Senkrecht_MPa=None):
        self.mara_nr = mara_nr
        self.mat_desc = mat_desc
        self.mat_int_desc = mat_int_desc
        self.mat_rw = mat_rw
        self.t_fam_id = t_fam_id
        self.campus_fam = campus_fam
        self.user_id = user_id
        self.t_mara_art_id = t_mara_art_id
        self.upload_kind = upload_kind
        self.created_at = created_at
        self.updated_at = updated_at
        self.dichte = dichte
        self.unit = unit
        self.del_kz = del_kz
        self.producer = producer
        self.Verarbeitungsmethode = Verarbeitungsmethode
        self.Belastung = Belastung
        self.Temperatur = Temperatur
        self.MVR = MVR
        self.Bruchdehnung = Bruchdehnung
        self.Bruchdehnung_Nominell = Bruchdehnung_Nominell
        self.Bruchdehnung_TPE = Bruchdehnung_TPE
        self.Bruchdehnung_Senkrecht = Bruchdehnung_Senkrecht
        self.Bruchdehnung_Parallel = Bruchdehnung_Parallel
        self.Bruchspannung_MPa = Bruchspannung_MPa
        self.Bruchspannung_TPE_MPa = Bruchspannung_TPE_MPa
        self.Bruchspannung_Parallel_MPa = Bruchspannung_Parallel_MPa
        self.Bruchspannung_Senkrecht_Mpa = Bruchspannung_Senkrecht_Mpa
        self.Zugmodul_MPa = Zugmodul_MPa
        self.Zugmodul_Kriech_1h_MPa = Zugmodul_Kriech_1h_MPa
        self.Zugmodul_Kriech_1000h_MPa = Zugmodul_Kriech_1000h_MPa
        self.Zugmodul_Parallel_MPa = Zugmodul_Parallel_MPa
        self.Zugmodul_Senkrecht_MPa = Zugmodul_Senkrecht_MPa

    def json(self):
        return { 'id' : self.id, 'mara_nr' : self.mara_nr, 'mat_desc' : self.mat_desc, 'mat_int_desc' : self.mat_int_desc, 'mat_rw' : self.mat_rw, 't_fam_id' : self.t_fam_id, 'campus_fam' : self.campus_fam, 'user_id' : self.user_id,
                 't_mara_art_id' : self.t_mara_art_id, 'upload_kind' : self.upload_kind, 'dichte' : self.dichte, 'unit' : self.unit, 'del_kz' : self.del_kz,
                 'producer' : self.producer, 'Verarbeitungsmethode' : self.Verarbeitungsmethode, 'Belastung' : self.Belastung, 'Temperatur' : self.Temperatur, 'MVR' : self.MVR, 'Bruchdehnung' : self.Bruchdehnung,
                 'Bruchdehnung_Nominell' : self.Bruchdehnung_Nominell, 'Bruchdehnung_TPE' : self.Bruchdehnung_TPE, 'Bruchdehnung_Senkrecht' : self.Bruchdehnung_Senkrecht, 'Bruchdehnung_Parallel' : self.Bruchdehnung_Parallel,
                 'Bruchspannung_MPa' : self.Bruchspannung_MPa, 'Bruchspannung_TPE_MPa' : self.Bruchspannung_TPE_MPa, 'Bruchspannung_Parallel_MPa' : self.Bruchspannung_Parallel_MPa, 'Bruchspannung_Senkrecht_Mpa' : self.Bruchspannung_Senkrecht_Mpa,
                 'Zugmodul_MPa' : self.Zugmodul_MPa, 'Zugmodul_Kriech_1h_MPa' : self.Zugmodul_Kriech_1h_MPa, 'Zugmodul_Kriech_1000h_MPa' : self.Zugmodul_Kriech_1000h_MPa, 'Zugmodul_Parallel_MPa' : self.Zugmodul_Parallel_MPa, 'Zugmodul_Senkrecht_MPa' : self.Zugmodul_Senkrecht_MPa }


    @classmethod
    def find_by_user_id(cls, user_id):
        sql = text("SELECT mara.id, mara.mara_nr, mara.mat_desc, mara.mat_int_desc, mara.mat_rw, mara.t_fam_id, t_fam.fam_dimop_desc, mara.campus_fam, mara.user_id, user.firstname, user.surname, mara.t_mara_art_id, t_mara_art.art, mara.upload_kind, mara.dichte, mara.unit, mara.del_kz, mara.producer, mara.Verarbeitungsmethode, mara.Belastung, mara.Temperatur, mara.MVR, mara.Bruchdehnung, mara.Bruchdehnung_Nominell, mara.Bruchdehnung_TPE, mara.Bruchdehnung_Parallel, mara.Bruchdehnung_Senkrecht, mara.Bruchspannung_MPa, mara.Bruchspannung_TPE_MPa, mara.Bruchspannung_Parallel_MPa, mara.Bruchspannung_Senkrecht_MPa, mara.Zugmodul_MPa, mara.Zugmodul_Kriech_1h_MPa, mara.Zugmodul_Kriech_1000h_MPa, mara.Zugmodul_Parallel_MPa, mara.Zugmodul_Senkrecht_MPa FROM mara LEFT JOIN t_fam ON mara.t_fam_id=t_fam.id LEFT JOIN t_mara_art ON mara.t_mara_art_id=t_mara_art.id LEFT JOIN user ON mara.user_id=user.id WHERE mara.user_id=:user_id")
        result = db.session.execute(sql, params={"user_id": user_id})
        return result.fetchall()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()