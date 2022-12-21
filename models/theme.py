from db import db


class ThemeModel(db.Model):

    __tablename__ = "themes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=False, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)
    user = db.relationship("UserModel", back_populates="themes")
    comments = db.relationship("CommentModel", back_populates="themes", lazy="dynamic")
