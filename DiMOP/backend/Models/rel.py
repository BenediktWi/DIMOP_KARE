from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text


class RelModel(db.Model):
    __tablename__ = "rel"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    p_id = db.Column(db.Integer)
    m1_id = db.Column(db.Integer)
    m2_id = db.Column(db.Integer)
    rel_type = db.Column(db.Integer)

    def __init__(self, p_id, m1_id, m2_id, rel_type):
        self.p_id = p_id
        self.m1_id = m1_id
        self.m2_id = m2_id
        self.rel_type = rel_type

    def json(self):
        return {"id": self.id,
                "p_id": self.p_id,
                "m1_id": self.m1_id,
                "m2_id": self.m2_id,
                "rel_type": self.rel_type,
                }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    @classmethod
    def find_all(cls):
        sql = text("SELECT * FROM rel")
        result = db.session.execute(sql)
        return result.fetchall()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
