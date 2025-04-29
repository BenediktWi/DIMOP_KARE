from dbfunctions.connect import db
from sqlalchemy import text

class OriginModel(db.Model):
    __tablename__ = 't_origin'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(255))
    type_desc = db.Column(db.String(255))

    def __init__(self, type, type_desc):
        self.type = type
        self.type_desc = type_desc

    def json(self):
        return {'id' : self.id, 'type': self.type, 'type_desc': self.type_desc}

    @classmethod
    def find_all_origins(cls):
        sql = text("SELECT * from t_origin")
        result = db.session.execute(sql)
        return result.fetchall()