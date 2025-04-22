from dbfunctions.connect import db
from sqlalchemy import text

class OrgaModel(db.Model):
    __tablename__ = 'orga'

    id = db.Column(db.Integer, primary_key=True)
    orga_nr = db.Column(db.String)
    orga_name = db.Column(db.String)
    t_branch_id = db.Column(db.Integer)

    def __init__(self, orga_nr, orga_name, t_branch_id):
        self.orga_nr = orga_nr
        self.orga_name = orga_name
        self.t_branch_id = t_branch_id

    def json(self):
        return { 'id' : self.id, 'orga_nr' : self.orga_nr, 'orga_name' : self.orga_name, 't_branch_id' : self.t_branch_id}

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    @classmethod
    def find_all_Orgas(cls):
        sql = text("SELECT * from orga")
        result = db.session.execute(sql)
        return result.fetchall()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()