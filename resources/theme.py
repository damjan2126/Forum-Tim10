import uuid

from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError

import loggerFactory
from db import db
from models import ThemeModel
from schemas import CreateThemeSchema, ThemeSchema, ThemeOptionSchema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt

blp = Blueprint("themes", __name__, description="Operations on themes")

logger = loggerFactory.get_module_logger(__name__)


@blp.route("/theme/create")
class CreateTheme(MethodView):

    @blp.arguments(CreateThemeSchema)
    @blp.response(201, CreateThemeSchema)
    @jwt_required()
    def post(self, theme_data):
        user_id = get_jwt().get("sub")

        new_theme = ThemeModel(**theme_data)
        new_theme.id = uuid.uuid4().hex
        new_theme.owner_id = user_id

        try:
            db.session.add(new_theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE CREATE THEME POST")
            logger.error(error)
            abort(500, message="An error occurred while inserting the item.")

        return new_theme


@blp.route("/theme/<string:theme_id>")
class Theme(MethodView):
    @blp.response(200, ThemeSchema)
    @jwt_required()
    def get(self, theme_id):
        theme = ThemeModel.query.get_or_404(theme_id)
        return theme

    @blp.response(200)
    @jwt_required()
    def delete(self, theme_id):
        theme = ThemeModel.query.get(theme_id)

        if not theme:
            abort(404, message="Theme id not found")

        if not theme.owner_id == get_jwt()["sub"]:
            abort(403, message="User is not owner of theme")

        try:
            db.session.delete(theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME DELETE")
            logger.error(error)
            abort(500, message="An error occurred while deleting the theme.")

        return {"message": "Theme deleted"}, 200

    @blp.arguments(ThemeOptionSchema)
    @blp.response(200, ThemeSchema)
    @jwt_required()
    def patch(self, theme_data, theme_id):
        theme = ThemeModel.query.get_or_404(theme_id)

        if not theme.owner_id == get_jwt()["sub"]:
            abort(403, message="You are not the owner")

        theme.open = theme_data["open"]

        try:
            db.session.add(theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME PATCH")
            logger.error(error)
            abort(500, message="An error occurred while patching the theme.")

        return theme
