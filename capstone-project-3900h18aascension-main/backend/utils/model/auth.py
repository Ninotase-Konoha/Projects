from flask import Flask
from flask_restx import fields, reqparse
from config import api


# login model
login_model = api.model("login", {
    "email": fields.String(required=True, example="longelizabeth@example.com"),
    "password": fields.String(required=True, example="(0wr5Vgv")})

auth_response_model = api.model("auth response", {
    "token": fields.String,
    "user_id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "avatar": fields.String,
    "created_at": fields.String})


# sign up
signup_model = api.model("signup", {
    "email": fields.String(required=True, example="abcd@example.net"),
    "password": fields.String(required=True, example="abcd1234??"),
    "username": fields.String(required=True, example="unique username"),
    "avatar": fields.String})


# token header in Bearer token format
token_parser = reqparse.RequestParser()
token_parser.add_argument(
    "Authorization",
    type=str,
    location="headers",
    required=True,
    nullable=False,
    help="format: Bearer <token>")
