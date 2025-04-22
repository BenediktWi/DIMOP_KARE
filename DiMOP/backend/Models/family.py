from dbfunctions.connect import db
from sqlalchemy import ForeignKey
from sqlalchemy import text

class FamilyModel(db.Model):
    __tablename__ = 't_fam'

    id = db.Column(db.Integer, primary_key=True)
    fam = db.Column(db.String)
    fam_dimop_desc = db.Column(db.String)
    level = db.Column(db.Integer)
    fam_weak = db.Column(db.Integer)

    def __init__(self, fam, fam_dimop_desc, level, fam_weak):
        self.fam = fam
        self.fam_dimop_desc = fam_dimop_desc
        self.level = level
        self.fam_weak = fam_weak

    def json(self):
        return { 'id' : self.id, 'fam' : self.fam, 'fam_dimop_desc' : self.fam_dimop_desc, 'level' : self.level, 'fam_weak': self.fam_weak}

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    @classmethod
    def find_all_Families(cls):
        sql = text("SELECT * from t_fam")
        result = db.session.execute(sql)
        return result.fetchall()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()