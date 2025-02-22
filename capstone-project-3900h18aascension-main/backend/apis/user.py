from flask import jsonify, request, abort
from flask_restx import Resource
import base64

from config import api
import utils.model.user as model
import utils.util.user as util
from utils.model.auth import token_parser
from utils.util.auth import check_token, is_email_unique, is_username_unique


user = api.namespace("user",
        description="user account management")


@user.route("/<int:user_id>")
@user.doc(params={"user_id": "integer user id"})
class UserAccount(Resource):
    @user.doc(description="get the user username, email, created_at, avatar")
    @user.response(200, "success", model.user_model)
    @user.response(400, "user_id does not exist")
    def get(self, user_id):
        user = util.get_user(user_id)
        if user is None:
            abort(401, "user_id {} does not exist".format(user_id))

        # remove token and password, if exists
        response = user.to_dict()
        response.pop("token", None)
        response.pop("password", None)

        return jsonify(response)


    @user.doc(description="only account owner can edit username, email, password, avatar")
    @api.expect(token_parser, model.user_edit_model)
    @user.response(200, "success")
    @user.response(400, "bad request")
    @user.response(401, "the user is not owner of this user_id")
    @user.response(403, "invalid token")
    @user.response(404, "new email is not unique")
    @user.response(405, "new username is not unique")
    @user.response(406, "avatar is not base64 string")
    def put(self, user_id):
        # check the token header
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # user exists, check if user id is that id
        if user.user_id != user_id:
            abort(401, "the user is not owner of this user_id {}".format(user_id))

        # correct user, check what he wants to edit
        data = request.json
        username = data.get("username", None)
        email = data.get("email", None)
        avatar = data.get("avatar", None)
        password = data.get("password", None)

        if username is not None:
            if not is_username_unique(username):
                abort(404, "new email is not unique")

        if email is not None:
            if not is_email_unique(email):
                abort(405, "new username is not unique")

        # test if the avatar is base64 string
        if avatar is not None:
            # the avatar should also be very long
            if len(avatar) <= 100:
                abort(406, "avatar should be base64 string format")

            try:
                avatar_bytes = bytes(avatar, 'ascii')
                base64.decodestring(avatar_bytes)
            except Exception as e:
                abort(406, "avatar not in base64")

        # update user
        util.update_user(user, username, email, avatar, password)
        response = util.get_user(user_id)
        response = response.to_dict()
        return jsonify(response)


    @user.doc(description="the account owner can delete the account")
    @api.expect(token_parser)
    @user.response(200, "success")
    @user.response(400, "bad request")
    @user.response(401, "the user is not owner of this user_id")
    @user.response(403, "invalid token")
    def delete(self, user_id):
        # check the token header
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # user exists, check if user id is that id
        if user.user_id != user_id:
            abort(401, "the user is not owner of this user_id {}".format(user_id))

        # delete this user
        util.delete_user(user_id)
        return


@user.route("/check_email_unique")
class CheckEmailUnique(Resource):
    @user.doc(description="check email uniqueness during the signup")
    @user.expect(model.email_model)
    @user.response(200, "unique email")
    @user.response(201, "email is not unique")
    @user.response(400, "bad request")
    def post(self):
        data = request.json
        email = data["email"]
        if is_email_unique(email):
            return "unique email", 200
        else:
            return "email is not unique", 201


@user.route("/check_username_unique")
class CheckEmailUnique(Resource):
    @user.doc(description="check username uniqueness during the signup")
    @user.expect(model.username_model)
    @user.response(200, "unique username")
    @user.response(201, "username not unique")
    @user.response(400, "bad request")
    def post(self):
        data = request.json
        username = data["username"]
        if is_username_unique(username):
            return "unique username", 200
        else:
            return "username is not unique", 201
