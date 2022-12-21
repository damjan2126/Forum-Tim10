import random
from sqlalchemy.exc import SQLAlchemyError
from loggerFactory import get_module_logger
from db import db
from models import UserModel
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import PlainUserSchema, UserSchema

blp = Blueprint("users", __name__, description="Operations on users")
logger = get_module_logger(__name__)

@blp.route("/app/<string:user_id>")
class User(MethodView):
    def get(self, user_id):
        logger.info(user_id)
        return "ok"

    def delete(self):
        pass

@blp.route("/user/register")
class UserRegister(MethodView):

    @blp.arguments(UserSchema)
    @blp.response(200, UserSchema)
    def post(self, user_data):
        user = UserModel(**user_data)
        user.id = 1
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while inserting the item.")

        return user

