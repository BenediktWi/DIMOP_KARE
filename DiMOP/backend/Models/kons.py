from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text
from sqlalchemy.sql import func

class KonsModel(db.Model):
    __tablename__ = 'kons'

    id = db.Column(db.Integer, primary_key=True)
    kons_title = db.Column(db.String(255))
    kons_desc = db.Column(db.Text(65535))
    orga_id = db.Column(db.Integer)
    mara_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime)
    updated_at = datetime
    del_kz = db.Column(db.Boolean)

    def __init__(self, kons_title, kons_desc, orga_id, mara_id, del_kz, created_at=None, updated_at=None):
        self.kons_title = kons_title
        self.kons_desc = kons_desc
        self.orga_id = orga_id
        self.mara_id = mara_id
        self.created_at = created_at
        self.updated_at = updated_at
        self.del_kz = del_kz

    def json(self):
        return { 'id' : self.id, 'kons_title' : self.kons_title, 'kons_desc' : self.kons_desc, 'orga_id' : self.orga_id, 'mara_id' : self.mara_id, 'del_kz' : self.del_kz}

    @classmethod
    def find_by_user_id(cls, user_id):
        sql = text("SELECT kons.id, kons.kons_title, kons.kons_desc, kons.orga_id, orga.orga_name, kons.mara_id, "
                   "mara.mara_nr, mara.mat_desc, kons.del_kz FROM kons LEFT JOIN "
                   "mara ON kons.mara_id=mara.id LEFT join orga ON kons.orga_id=orga.id LEFT JOIN perp on "
                   "perp.kons_id=kons.id LEFT JOIN user on perp.user_id=user.id where user.id=:user_id")
        #kons.created_at =:created
        #sql = sql.bindparams(created=datetime)
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