from flask import Flask
from flask_restx import fields
from config import api


# search author model
search_author_model = api.model("search author", {
    "keyword": fields.String(required=True, example="J. K. Rowling"),
    "page": fields.Integer(required=True, default=0, min=0),
    "item_on_page": fields.Integer(required=True, default=20, min=1),
    "sort": fields.String(required=True, default="name", enum=["name", "birthyear"]),
    "order": fields.String(required=True, default="asc", enum=["asc", "desc"])})
