from flask import Flask
from flask_restx import fields
from config import api


# top 30 category in the database,
# cover more than 80% of the books
enum_category = [
    "Fiction",
    "Juvenile Fiction",
    "Biography & Autobiography",
    "History",
    "Comics & Graphic Novels",
    "Novel",
    "Literary Criticism",
    "Philosophy",
    "Drama",
    "Religion",
    "Juvenile Nonfiction",
    "Business & Economics",
    "Poetry",
    "Literary Collections",
    "Science",
    "Social Science",
    "Psychology",
    "Body, Mind & Spirit",
    "Performing Arts",
    "Computers",
    "Political Science",
    "Art",
    "Humor",
    "Cooking",
    "Travel",
    "Self-Help",
    "Health & Fitness",
    "Family & Relationships",
    "Nature",
    "Language Arts & Disciplines",
]


# book search model
book_search_model = api.model("book search", {
    "keyword": fields.String(required=True, example="harry", default=""),
    "sort": fields.String(required=True, enum=["year", "rating"], default="year"),
    "order": fields.String(required=True, enum=["asc", "desc"], default="desc"),
    "category": fields.List(fields.String(enum=enum_category)),
    "from_year": fields.Integer(required=True, default=1500),
    "to_year": fields.Integer(required=True, default=2023),
    "page": fields.Integer(required=True, default=0, min=0),
    "item_on_page": fields.Integer(required=True, default=20, min=1)})


# the search response
mini_book_model = api.model("mini book", {
    "book_id": fields.Integer,
    "title": fields.String,
    "publisher": fields.String,
    "year": fields.Integer,
    "pageCount": fields.Integer,
    "thumbnail": fields.String,
    "description": fields.String,
    "isbn": fields.String,
    "language": fields.String,
    "rating": fields.Float})


book_search_response_model = api.model("book search response", {
    "page": fields.Integer,
    "item_on_page": fields.Integer,
    "total_page": fields.Integer,
    "books": fields.List(fields.Nested(mini_book_model))})


# book status response
book_status_response_model = api.model("book status response", {
    "user_id": fields.Integer,
    "book_id": fields.Integer,
    "status": fields.Boolean,
    "finished_at": fields.DateTime(help="if status is true, then finished_at is not None")})
