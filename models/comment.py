from db import db


class CommentModel(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    commentText = db.Column(db.String(1000), unique=False, nullable=False)
    authorId = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)
    user = db.relationship("UserModel", back_populates="comments")
