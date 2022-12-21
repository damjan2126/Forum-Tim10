from db import db


class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(30), unique=False, nullable=False)
    lastName = db.Column(db.String(30), unique=False, nullable=False)
    city = db.Column(db.String(30), unique=False, nullable=False)
    address = db.Column(db.String(30), unique=False, nullable=False)
    country = db.Column(db.String(30), unique=False, nullable=False)
    phoneNumber = db.Column(db.String(30), unique=False, nullable=False)
    email = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(30), unique=False, nullable=False)
    themes = db.relationship("ThemeModel", back_populates="user", lazy="dynamic")
