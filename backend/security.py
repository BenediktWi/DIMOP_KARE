from Models.user import UserModel
from werkzeug.security import safe_str_cmp
import hashlib

# def authenticate(surname, password):
#     user = UserModel.find_by_surname(surname)
#     if user and user.password == password:
#         return user

# def identity(payload):
#     user_id = payload['identity']
#     return UserModel.find_by_id(user_id)

#def authenticate(e_mail, password):
 #  user = UserModel.find_by_e_mail(e_mail) #if no email found, return none # email = Username
  # hashed_password = hashlib.sha512(password.encode('utf-8') + user.pw_salt.encode('utf-8')).hexdigest()
   #if user and safe_str_cmp(user.password, hashed_password):
    #  return user

#def authenticate(e_mail, password):
 #  user = UserModel.find_by_e_mail(e_mail) #if no email found, return none # email = Username
   #hashed_password = hashlib.sha512(password.encode('utf-8') + user.pw_salt.encode('utf-8')).hexdigest()
  # if user and safe_str_cmp(user.password, password):
   #   return user

def authenticate(e_mail, password):
   user = UserModel.find_by_e_mail(e_mail) #if no email found, return none # email = Username
   print(user)
   hashed_password = hashlib.sha512(password.encode('utf-8') + user.pw_salt.encode('utf-8')).hexdigest()
   if user and safe_str_cmp(user.password, hashed_password):
      return user

def identity(payload):
   user_id = payload['identity']
   return UserModel.find_by_id(user_id)

