from db import db


class ThemesAndSubs(db.Model):
    __tablename__ = "themes_subscribers"

    id = db.Column(db.String(33), primary_key=True)
    sub_id = db.Column(db.String(33), db.ForeignKey("users.id"))
    theme_id = db.Column(db.String(33), db.ForeignKey("themes.id"))
