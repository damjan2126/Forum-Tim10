from sqlalchemy import func

from db import db


class ThemeModel(db.Model):

    __tablename__ = "themes"

    id = db.Column(db.String(33), primary_key=True)
    title = db.Column(db.String(80), unique=False, nullable=False)
    open = db.Column(db.Boolean, unique=False, nullable=False)
    owner_id = db.Column(db.String(33), db.ForeignKey("users.id"), unique=False, nullable=False)
    owner = db.relationship("UserModel", back_populates="themes")
    comments = db.relationship("CommentModel", back_populates="themes", lazy="dynamic")
    subscribers = db.relationship("UserModel", back_populates="subbedThemes", secondary="themes_subscribers")
    comment_count = db.Column(db.Integer, unique=False, nullable=True, server_default='0')
    like_count = db.Column(db.Integer, unique=False, nullable=True, server_default='0')
    dislike_count = db.Column(db.Integer, unique=False, nullable=True, server_default='0')
    subbed = db.Column(db.Boolean, unique=False, nullable=True)
