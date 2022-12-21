import random

from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from sqlalchemy.exc import SQLAlchemyError
from passlib.hash import pbkdf2_sha256

from blocklist import BLOCKLIST
from loggerFactory import get_module_logger
from db import db
from models import UserModel
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import PlainUserSchema, UserSchema, UserLoginSchema

blp = Blueprint("users", __name__, description="Operations on users")
logger = get_module_logger(__name__)


@blp.route("/user/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 200


@blp.route("/user/<string:user_id>")
class User(MethodView):

    @jwt_required()
    def get(self, user_id):
        logger.info(user_id)
        return "ok"

    def delete(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return "ok"


@blp.route("/user/register")
class UserRegister(MethodView):

    @blp.arguments(UserSchema)
    @blp.response(200, UserSchema)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.email == user_data["email"]).first():
            abort(409, message="A user with that username already exists.")

        user = UserModel(**user_data)
        user.password = pbkdf2_sha256.hash(user_data["password"])
        logger.info(user.password)

        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully."}, 201


@blp.route("/user/login")
class UserLogin(MethodView):
    @blp.arguments(UserLoginSchema)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.email == user_data["email"]
        ).first()

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=user.id)
            return {"access_token": access_token}, 200

        abort(401, message="Invalid credentials.")
