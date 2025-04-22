from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text


class BomModel(db.Model):
    __tablename__ = "bom"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    mat_id = db.Column(db.Integer)
    parent_mat_id = db.Column(db.Integer)

    def __init__(self, mat_id, parent_mat_id):
        self.mat_id = mat_id
        self.parent_mat_id = parent_mat_id

    def json(self):
        return {"id": self.id, "mat_id": self.mat_id, "parent_mat_id": self.parent_mat_id}

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    @classmethod
    def find_all(cls):
        sql = text("SELECT * FROM bom")
        result = db.session.execute(sql)
        return result.fetchall()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
