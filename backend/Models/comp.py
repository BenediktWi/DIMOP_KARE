from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text

class CompModel(db.Model):
    __tablename__ = 'comp'

    id = db.Column(db.Integer, primary_key=True)
    t_fam_id_parent = db.Column(db.Integer)
    t_fam_id_child = db.Column(db.Integer)
    t_origin_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    orga_id = db.Column(db.Integer)
    comp_value = db.Column(db.Float(12,4))

    def __init__(self, t_fam_id_parent, t_fam_id_child, t_origin_id, user_id, orga_id, comp_value):
        self.t_fam_id_parent = t_fam_id_parent
        self.t_fam_id_child = t_fam_id_child
        self.t_origin_id = t_origin_id
        self.user_id = user_id
        self.orga_id = orga_id
        self.comp_value = comp_value

    def json(self):
        return { 'id' : self.id, 't_fam_id_parent' : self.t_fam_id_parent, 't_fam_id_child' : self.t_fam_id_child, 't_origin_id' : self.t_origin_id, 'user_id' : self.user_id, 'orga_id' : self.orga_id, 'comp_value' : self.comp_value}

    @classmethod
    def find_by_t_fam_id(cls, t_fam_id):
        sql = text("SELECT comp.id, comp.t_fam_id_parent, F1.fam AS parent_fam, comp.t_fam_id_child, F2.fam AS child_fam, t_origin.type_desc, comp.comp_value, user.firstname, user.surname FROM comp LEFT JOIN user ON comp.user_id=user.id LEFT JOIN t_origin ON comp.t_origin_id=t_origin.id LEFT JOIN t_fam AS F1 ON comp.t_fam_id_parent=F1.id LEFT JOIN t_fam AS F2 ON comp.t_fam_id_child=F2.id WHERE comp.t_fam_id_parent=:t_fam_id")
        result = db.session.execute(sql, params={"t_fam_id": t_fam_id})
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