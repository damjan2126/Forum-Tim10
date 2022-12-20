import uuid
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import users
from schemas import UserRegister

blp = Blueprint("users", __name__, description="Operations on users")

@blp.route("/app/<string:user_id>")
class User(MethodView):
    def get(self, user_id):
        return users[user_id]

    def delete(self):
        pass

@blp.route("/user/register")
class UserRegister(MethodView):

    @blp.arguments(UserRegister)
    @blp.response(200)
    def post(self, user_data):
        user_id = uuid.uuid4().hex
        user = {**user_data, "id": user_id}
        users[user_id] = user

        return user
