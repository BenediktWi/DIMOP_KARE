from dbfunctions.connect import db
from sqlalchemy import text

class PerpModel(db.Model):
    __tablename__ = 'perp'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    orga_id = db.Column(db.Integer)
    kons_id = db.Column(db.Integer, db.ForeignKey('kons.id'))
    auth_read = db.Column(db.Boolean)
    auth_write = db.Column(db.Boolean)
    auth_delete = db.Column(db.Boolean)
    del_kz = db.Column(db.Boolean)

    def __init__(self, user_id, orga_id, kons_id,auth_read, auth_write, auth_delete, del_kz):
        self.user_id = user_id
        self.orga_id = orga_id
        self.kons_id = kons_id
        self.auth_read = auth_read
        self.auth_write = auth_write
        self.auth_delete = auth_delete
        self.del_kz = del_kz

    def json(self):
        return { 'id' : self.id, 'user_id' : self.user_id, 'orga_id' : self.orga_id, 'auth_read' : self.auth_read, 'auth_write' : self.auth_write, 'auth_delete' : self.auth_delete, 'del_kz' : self.del_kz}

    @classmethod
    def find_by_kons_id(cls, kons_id):
        sql = text("SELECT perp.id, perp.user_id, user.firstname, user.surname, user.e_mail, perp.orga_id, orga.orga_name, user.t_function_id, t_function.function, perp.auth_read, perp.auth_write, perp.auth_delete, perp.del_kz FROM perp LEFT JOIN orga ON perp.orga_id=orga.id LEFT JOIN user ON perp.user_id=user.id LEFT JOIN t_function ON user.t_function_id=t_function.id WHERE perp.kons_id=:kons_id")
        result = db.session.execute(sql, params={"kons_id": kons_id})
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