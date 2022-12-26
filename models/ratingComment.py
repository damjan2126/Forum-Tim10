from db import db

class RatingCommentModel(db.Model):

    __tablename__ = "comment_ratings"

    id = db.Column(db.String(33), primary_key=True)
    comment_id = db.Column(db.String(33), db.ForeignKey("comments.id"), unique=False, nullable=False)
    user_id = db.Column(db.String(33), db.ForeignKey("users.id"), unique=False, nullable=False)
    rating = db.Column(db.Boolean, unique=False, nullable=False)
