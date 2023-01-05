import os
import uuid

from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from sqlalchemy.exc import SQLAlchemyError
from passlib.hash import pbkdf2_sha256


from blocklist import BLOCKLIST
from loggerFactory import get_module_logger
from db import db
from models import UserModel
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import PlainUserSchema, UserLoginSchema, UserSchema, UpdateUserSchema, UserUpdatePasswordSchema

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
    @blp.response(200, UserSchema)
    @jwt_required()
    def get(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        return user

    @blp.arguments(UpdateUserSchema)
    @blp.response(200, UserSchema)
    @jwt_required()
    def put(self, user_data, user_id):
        if not user_id == get_jwt()["sub"]:
            abort(403, "Cant update another user")

        try:
            user = db.session.query(UserModel).filter(UserModel.id == user_id)
            user.update(
                user_data
            )

            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE USER PUT")
            logger.error(error)
            abort(500, message="An error occurred while inserting the item.")

        user = UserModel.query.get(user_id)

        return user

    @blp.arguments(UserUpdatePasswordSchema)
    @blp.response(201)
    @jwt_required()
    def patch(self, user_data, user_id):
        if not user_id == get_jwt()["sub"]:
            abort(403, "Cant update another user")

        user_data["password"] = pbkdf2_sha256.hash(user_data["password"])

        user = UserModel.query.get_or_404(user_id)

        user.password = user_data["password"]

        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE USER PATCH")
            logger.error(error)
            abort(500, message="An error occurred while changing the password.")

        UserLogout().post()

        return {"message": "Password successfully updated"}, 201


@blp.route("/user/register")
class UserRegister(MethodView):

    @blp.arguments(PlainUserSchema)
    @blp.response(201)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.email == user_data["email"]).first():
            abort(409, message="A user with that email already exists.")

        user = UserModel(**user_data)
        user.id = uuid.uuid4().hex
        user.password = pbkdf2_sha256.hash(user_data["password"])
        logger.info(user.password)

        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE REGISTER USER POST")
            logger.error(error)
            abort(500, message="An error occurred while inserting the item.")

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
            return {"access_token": access_token, "user_id": user.id}, 200

        abort(401, message="Invalid credentials.")
