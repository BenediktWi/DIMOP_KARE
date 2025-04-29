from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text
from sqlalchemy.sql import func


class ConsModel(db.Model):
    __tablename__ = 'cons'

    id = db.Column(db.Integer, primary_key=True)
    cons_title = db.Column(db.String(255))
    cons_desc = db.Column(db.Text(65535))
    orga_id = db.Column(db.Integer)
    del_kz = db.Column(db.Boolean)

    def __init__(self, cons_title, cons_desc, orga_id, del_kz, created_at=None):
        self.cons_title = cons_title
        self.cons_desc = cons_desc
        self.orga_id = orga_id
        self.del_kz = del_kz

    def json(self):
        return {'id': self.id, 'cons_title': self.cons_title, 'cons_desc': self.cons_desc, 'orga_id': self.orga_id, 'del_kz': self.del_kz}

    @classmethod
    def find_by_orga_id(cls, orga_id):
        sql = text(
            "SELECT id, cons_title, cons_desc, orga_id, del_kz FROM cons WHERE cons.orga_id=:orga_id")
        result = db.session.execute(sql, params={"orga_id": orga_id})
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
