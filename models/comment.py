from db import db


class CommentModel(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    commentText = db.Column(db.String(1000), unique=False, nullable=False)
    authorId = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)
    user = db.relationship("UserModel", back_populates="comments")
    themeId = db.Column(db.Integer, db.ForeignKey("themes.id"), unique=False, nullable=False)
    themes = db.relationship("ThemeModel", back_populates="comments")
