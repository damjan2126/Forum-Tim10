from flask import Flask
from flask_smorest import Api
import logging

from db import db
from models import ThemeModel, UserModel

from resources.theme import blp as ThemeBlueprint
from resources.user import blp as UserBlueprint


def create_app():
    app = Flask(__name__)

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "Forum REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:password@172.17.0.2:3306/ForumDb"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    api = Api(app)

    with app.app_context():
        db.create_all()

    api.register_blueprint(ThemeBlueprint)
    api.register_blueprint(UserBlueprint)

    return app