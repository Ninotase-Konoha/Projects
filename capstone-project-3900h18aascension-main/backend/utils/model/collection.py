from flask import Flask
from flask_restx import fields, reqparse
from config import api


# collection
collection_model = api.model("new collection", {
    "title": fields.String(required=True, example="collection title here"),
    "description": fields.String(required=True, example="some description here")})
