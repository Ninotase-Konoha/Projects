from flask import Flask
from flask_restx import fields
from config import api

# response user info
user_model = api.model("user model", {
    "user_id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "avatar": fields.String,
    "created_at": fields.String})


# user can edit info
user_edit_model = api.model("user model", {
    "username": fields.String,
    "email": fields.String,
    "avatar": fields.String,
    "password": fields.String})


# user check email and username unique or not
email_model = api.model("email model", {
    "email": fields.String(required=True, example="abc@email.com")})

username_model = api.model("username model", {
    "username": fields.String(required=True, example="unique username")})
