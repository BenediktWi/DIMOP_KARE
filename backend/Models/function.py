from dbfunctions.connect import db
from sqlalchemy import text

class FunctionModel(db.Model):
    __tablename__ = 't_function'

    id = db.Column(db.Integer, primary_key=True)
    function = db.Column(db.String(255))

    def __init__(self, function):
        self.function = function

    def json(self):
        return {'id' : self.id, 'function': self.function}

    @classmethod
    def find_all_functions(cls):
        sql = text("SELECT * from t_function")
        result = db.session.execute(sql)
        return result.fetchall()