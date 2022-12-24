from db import db

class ThemeRatingModel(db.Model):

    __tablename__ = "theme_ratings"

    id = db.Column(db.String(33), primary_key=True)
    theme_id = db.Column(db.String(33), db.ForeignKey("themes.id"), unique=False, nullable=False)
    user_id = db.Column(db.String(33), db.ForeignKey("users.id"), unique=False, nullable=False)
    rating = db.Column(db.Boolean, unique=False, nullable=False)
