import uuid
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import users

blp = Blueprint("themes", __name__, description="Operations on themes")
