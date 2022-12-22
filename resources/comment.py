import uuid

from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError

import loggerFactory
from db import db
from models import ThemeModel
from schemas import CreateThemeSchema, ThemeSchema, ThemeOptionSchema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt

blp = Blueprint("comments", __name__, description="Operations on comments")

logger = loggerFactory.get_module_logger(__name__)