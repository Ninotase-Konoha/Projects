from flask import Flask
from flask_restx import fields, reqparse
from config import api


review_model = api.model("post review", {
    "review": fields.String(required=True, example="good book!!"),
    "rating": fields.Float(required=True, min=0.0, max=5.0)})
