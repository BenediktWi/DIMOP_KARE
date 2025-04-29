from dbfunctions.connect import db
from sqlalchemy import text

class ReltypModel(db.Model):
    __tablename__ = 't_reltyp'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(255))
    kind = db.Column(db.String(255))

    def __init__(self, type, kind):
        self.type = type
        self.kind = kind

    def json(self):
        return {'id' : self.id, 'type': self.type, 'kind':self.kind}

    @classmethod
    def find_all_reltyps(cls):
        sql = text("SELECT * from t_reltyp")
        result = db.session.execute(sql)
        return result.fetchall()