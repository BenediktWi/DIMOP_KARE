import sqlite3
from flask_sqlalchemy import SQLAlchemy

def connect_db():
    db_connection = sqlite3.connect("DIMOP_DATENBANK.db")
    
    return db_connection

db = SQLAlchemy()
#http://localhost:5000/getMara?userid=1
