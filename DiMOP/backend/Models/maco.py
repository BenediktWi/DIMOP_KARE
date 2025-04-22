from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text

class MacoModel(db.Model):
    __tablename__ = 'maco'

    id = db.Column(db.Integer, primary_key=True)
    stpo_id_comp_a = db.Column(db.Integer)
    stpo_id_comp_b = db.Column(db.Integer)
    t_reltyp_id = db.Column(db.Integer)
    mass_product = db.Column(db.Float(12,4))

    def __init__(self, stpo_id_comp_a, stpo_id_comp_b, t_reltyp_id, mass_product):
        self.stpo_id_comp_a = stpo_id_comp_a
        self.stpo_id_comp_b = stpo_id_comp_b
        self.t_reltyp_id = t_reltyp_id
        self.mass_product = mass_product

    def json(self):
        return { 'id' : self.id, 'stpo_id_comp_a' : self.stpo_id_comp_a, 'stpo_id_comp_b' : self.stpo_id_comp_b, 't_reltyp_id' : self.t_reltyp_id, 'mass_product' : self.mass_product}

    @classmethod
    def find_by_stpo_id(cls, stpo_id):
        sql = text("SELECT maco.id, maco.stpo_id_comp_a, M1.mat_desc AS mat_desc_comp_a, S1.pos AS pos_comp_a, maco.stpo_id_comp_b, M2.mat_desc AS mat_desc_comp_b, S2.pos AS pos_comp_b, t_reltyp.`type`, t_reltyp.kind, maco.mass_product FROM maco LEFT JOIN t_reltyp on maco.t_reltyp_id=t_reltyp.id LEFT JOIN stpo AS S1 ON maco.stpo_id_comp_a=S1.id LEFT JOIN stpo AS S2 ON maco.stpo_id_comp_b=S2.id LEFT JOIN mara AS M1 ON S1.mara_id=M1.id lEFT JOIN mara AS M2 ON S2.mara_id=M2.id WHERE S1.id=:stpo_id")
        result = db.session.execute(sql, params={"stpo_id": stpo_id})
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