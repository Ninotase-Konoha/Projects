from flask import jsonify, request, abort
from flask_restx import Resource
import base64

from config import api
import utils.model.auth as model
import utils.util.auth as util


auth = api.namespace("auth",
        description="login and signup")


@auth.route("/login")
class Login(Resource):
    @auth.doc(description="login with email and password")
    @auth.expect(model.login_model)
    @auth.response(200, "success login", model.auth_response_model)
    @auth.response(400, "bad request")
    @auth.response(401, "incorrect email and password pair")
    @auth.response(402, "missing email or password")
    def post(self):
        # parse the json
        # the flask api will do the validation
        data = request.json
        email = data["email"]
        password = data["password"]

        # check if user exists
        user = util.get_user(email, password)
        if user is None:
            abort(401, "incorrect email and password pair")

        response = util.login_user(user)
        return jsonify(response)


@auth.route("/signup")
class Signup(Resource):
    @auth.doc(description="sign up with unique username and email, password, and optional avatar")
    @api.expect(model.signup_model)
    @auth.response(200, "success", model.auth_response_model)
    @auth.response(400, "bad request")
    @auth.response(401, "avatar not in base64 / avatar is not a base64 image string")
    @auth.response(403, "username and email require unique")
    def post(self):
        # the api layer will do the validation
        # only avatar can be none
        data = request.json
        email = data["email"]
        password = data["password"]
        username = data["username"]
        avatar = data.get("avatar", None)

        # test if the avatar is base64 string
        if avatar is not None:
            # the avatar should also be very long
            if len(avatar) <= 100:
                abort(401, "avatar should be base64 string format")

            # https://stackoverflow.com/questions/12315398/check-if-a-string-is-encoded-in-base64-using-python
            try:
                avatar_bytes = bytes(avatar, 'ascii')
                base64.decodestring(avatar_bytes)
            except Exception as e:
                # print(e)
                abort(401, "avatar not in base64")

        # check email and password unique
        if not util.is_email_unique(email):
            abort(403, "email is not unique")

        if not util.is_username_unique(username):
            abort(403, "username is not unique")

        # signup this user
        new_user = util.signup_user(username, email, password, avatar)
        response = util.login_user(new_user)
        return jsonify(response)
