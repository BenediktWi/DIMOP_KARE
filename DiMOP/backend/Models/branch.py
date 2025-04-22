from dbfunctions.connect import db
from sqlalchemy import text

class BranchModel(db.Model):
    __tablename__ = 't_branch'

    id = db.Column(db.Integer, primary_key=True)
    branch_name = db.Column(db.String(255))

    def __init__(self, branch_name):
        self.branch_name = branch_name

    def json(self):
        return {'id' : self.id, 'branch_name': self.branch_name}

    @classmethod
    def find_all_branches(cls):
        sql = text("SELECT * from t_branch")
        result = db.session.execute(sql)
        return result.fetchall()