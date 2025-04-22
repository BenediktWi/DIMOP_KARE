from dbfunctions.connect import db
from datetime import datetime
from sqlalchemy import text

class UserModel(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    e_mail = db.Column(db.String(255))
    orga_id = db.Column(db.Integer)
    t_function_id = db.Column(db.Integer)
    created_at = datetime
    updated_at = datetime
    password = db.Column(db.String(1024))
    pw_salt = db.Column(db.String(1024))
    del_kz = db.Column(db.Boolean)

    def __init__(self,  e_mail, password, firstname, surname=None, orga_id=None, t_function_id=None, created_at=None, updated_at=None, pw_salt=None, del_kz=None):
        self.firstname = firstname
        self.surname = surname
        self.e_mail = e_mail
        self.orga_id = orga_id
        self.t_function_id = t_function_id
        self.created_at = created_at
        self.updated_at = updated_at
        self.password = password
        self.pw_salt = pw_salt
        self.del_kz = del_kz

    def json(self):
        return { 
            'id' : self.id, 
            'firstname' : self.firstname, 
            'surname' : self.surname, 
            'e_mail' : self.e_mail, 
            'orga_id' : self.orga_id, 
            't_function_id' : self.t_function_id, 
            'del_kz' : self.del_kz
        }


    @classmethod
    def find_by_surname(cls, surname):
        return cls.query.filter_by(surname=surname).first()

    #@classmethod
    #def find_by_e_mail(cls, e_mail):
     #   sql = text("SELECT user.id, user.firstname, user.surname, user.e_mail, user.orga_id, user.password, orga.orga_name, user.t_function_id, t_function.`function`, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id WHERE user.e_mail=:e_mail")
      #  result = db.session.execute(sql, params={"e_mail": e_mail})
       # return result.fetchall()
    
    #@classmethod
    #def find_by_email(cls, e_mail):
    #  #  return cls.query.filter_by(e_mail=e_mail).first()

    #@classmethod
    #def find_by_id(cls, _id):
     #   return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_by_e_mail(cls, e_mail):
        return cls.query.filter_by(e_mail=e_mail).first()

    #@classmethod
    #def find_by_id(cls, _id):
     #   sql = text("SELECT user.id, user.firstname, user.surname, user.e_mail, user.orga_id, orga.orga_name, user.t_function_id, t_function.`function`, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id WHERE user.id=:id")
      #  result = db.session.execute(sql, params={"id": _id})
       # return result.fetchall()

    @classmethod
    def find_by_id(cls, _id):
        sql = text("SELECT user.id, user.firstname, user.surname, user.e_mail, user.orga_id, user.password, orga.orga_name, user.t_function_id, t_function.`function`, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id WHERE user.id=:id")
        result = db.session.execute(sql, params={"id": _id})
        return result.fetchall()

    @classmethod
    def find_all_Users(cls):
        sql = text("SELECT user.id, user.firstname, user.surname, user.e_mail, user.orga_id, orga.orga_name, user.t_function_id, t_function.function, user.del_kz FROM user LEFT JOIN orga ON user.orga_id=orga.id LEFT JOIN t_function ON user.t_function_id=t_function.id")
        result = db.session.execute(sql)
        return result.fetchall()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
