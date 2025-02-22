from flask import jsonify, request, abort
from flask_restx import Resource

from config import api
import utils.model.book as model
import utils.util.book as util
from utils.model.auth import token_parser
from utils.util.auth import check_token
from utils.util.user import get_user


book = api.namespace("book",
        description="book related api")


@book.route("/<int:book_id>")
@book.doc(params={"book_id": "integer book id"})
class BookDetail(Resource):
    @book.doc(description="""
        Get all details of this book,
        including book info, reviews, authors,
        how many people have added this book into their collection,
        how many people have finished reading this book""")
    @book.response(200, "success")
    @book.response(400, "bad request")
    @book.response(401, "book_id does not exist")
    def get(self, book_id):
        response = util.get_book(book_id)
        if response is None:
            abort(401, "book_id {} does not exist".format(book_id))

        return jsonify(response)


@book.route("/search")
class BookSearch(Resource):
    @book.doc(description="search book / get all books, with some filters")
    @book.expect(model.book_search_model)
    @book.response(200, "success", model.book_search_response_model)
    @book.response(400, "bad request")
    def post(self):
        params = request.json
        response = util.search_books(params)
        return jsonify(response)


@book.route("/finished/<int:user_id>")
class BookFinish(Resource):
    @book.doc(description="get all finished reading books for a user")
    @book.response(200, "success")
    @book.response(400, "bad request")
    @book.response(401, "user_id does not exist")
    def get(self, user_id):
        user = get_user(user_id)
        if user is None:
            abort(401, "user_id {} does not exist".format(user_id))

        response = util.get_finished_books(user_id)
        return jsonify(response)


@book.route("/read_status/<int:book_id>")
class BookReadStatus(Resource):
    @book.doc(description="user uses token and book id to check the reading status on this book")
    @book.expect(token_parser)
    @book.response(200, "success", model.book_status_response_model)
    @book.response(400, "bad request")
    @book.response(401, "book id not found")
    @book.response(403, "invalid token")
    @book.response(404, "book id does not exist")
    def get(self, book_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check the book exist
        book = util.check_book(book_id)
        if book is None:
            abort(404, "book id {} does not exist".format(book_id))

        # check the reading status
        status = util.check_read(user.user_id, book_id)
        return jsonify(status)


    @book.doc(description="user uses token and book id mark a book as finish")
    @book.expect(token_parser)
    @book.response(200, "success", model.book_status_response_model)
    @book.response(400, "bad request")
    @book.response(401, "book id not found")
    @book.response(403, "invalid token")
    @book.response(404, "book id does not exist")
    @book.response(406, "you already read book_id")
    def post(self, book_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check the book exist
        book = util.check_book(book_id)
        if book is None:
            abort(404, "book id {} does not exist".format(book_id))

        # check read first
        status = util.check_read(user.user_id, book_id)
        if status["status"] == True:
            abort(406, "you already read book_id {}".format(book_id))

        # mark that book as finish
        util.finish_read(user.user_id, book_id)

        # return status
        response = util.check_read(user.user_id, book_id)
        return jsonify(response)


    @book.doc(description="""
        user uses token and book id to mark a book as unfinish.
        but the reviews associated with this book, will also be deleted.
        """)
    @book.expect(token_parser)
    @book.response(200, "success")
    @book.response(400, "bad request")
    @book.response(401, "book id not found")
    @book.response(403, "invalid token")
    @book.response(404, "book id does not exist")
    def delete(self, book_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check the book exist
        book = util.check_book(book_id)
        if book is None:
            abort(404, "book id {} does not exist".format(book_id))

        # delete that record
        util.delete_finish_book(user.user_id, book_id)
        return
