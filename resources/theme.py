import uuid
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort

blp = Blueprint("themes", __name__, description="Operations on themes")
