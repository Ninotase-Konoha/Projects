from flask import jsonify, request, abort
from flask_restx import Resource

from config import api
import utils.model.collection as model
import utils.util.collection as util
from utils.model.auth import token_parser
from utils.util.auth import check_token, is_email_unique, is_username_unique
from utils.util.user import get_user
from utils.util.book import check_book, check_read


collection = api.namespace("collection",
    description="user views and manages collections")


@collection.route("/user/<int:user_id>")
@collection.doc(params={"user_id": "integer user id"})
class CollectionDetail(Resource):
    @collection.doc(description="get this user's collections")
    @collection.response(200, "success")
    @collection.response(400, "bad request")
    @collection.response(401, "user_id does not exist")
    def get(self, user_id):
        user = get_user(user_id)
        if user is None:
            abort(401, "user_id {} does not exist".format(user_id))

        response = util.get_user_collection(user_id)
        return jsonify(response)


@collection.route("/new")
class CollectionAdd(Resource):
    @collection.doc(description="the user uses token, and post to create a new collection with title and description")
    @collection.expect(token_parser, model.collection_model)
    @collection.response(200, "success, return nothing")
    @collection.response(400, "bad request")
    @collection.response(403, "invalid token")
    def post(self):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # get title and description from json
        data = request.json
        title = data["title"]
        description = data["description"]

        util.create_new_collection(user.user_id, title, description)
        return


@collection.route("/<int:collection_id>")
@collection.doc(params={"collection_id": "integer collection id"})
class CollectionEdit(Resource):
    @collection.doc(description="the collection owner can change the collection title or description")
    @collection.expect(token_parser, model.collection_model)
    @collection.response(200, "success, return nothing")
    @collection.response(400, "bad request")
    @collection.response(401, "collection_id does not exist")
    @collection.response(403, "invalid token")
    @collection.response(406, "collection_id does not belong to this user")
    def put(self, collection_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check collection
        collection = util.check_collection(collection_id)
        if collection is None:
            abort(401, "collection_id {} does not exist".format(collection_id))

        # check if the user owns the collection
        if collection.user_id != user.user_id:
            abort(406, "this collection id does not belong to the user")

        # get new data
        data = request.json
        title = data["title"]
        description = data["description"]
        util.update_collection(collection, title, description)
        return

    @collection.doc(description="the collection owner can delete this collection")
    @collection.expect(token_parser)
    @collection.response(200, "success delete, return nothing")
    @collection.response(400, "bad request")
    @collection.response(401, "collection_id does not exist")
    @collection.response(403, "invalid token")
    @collection.response(406, "collection_id does not belong to this user")
    def delete(self, collection_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check collection
        collection = util.check_collection(collection_id)
        if collection is None:
            abort(401, "collection_id {} does not exist".format(collection_id))

        # check if the user owns the collection
        if collection.user_id != user.user_id:
            abort(406, "this collection id does not belong to the user")

        # delete the collection records, and all book records within it
        util.delete_collection(collection_id)
        return


@collection.route("/<int:collection_id>/book/<int:book_id>")
@collection.doc(params={
    "collection_id": "integer collection id",
    "book_id": "integer book id"})
class CollectionWithBook(Resource):
    @collection.doc("add a new book into the collection")
    @collection.expect(token_parser)
    @collection.response(200, "success, return nothing")
    @collection.response(400, "bad request")
    @collection.response(401, "collection_id does not exist")
    @collection.response(402, "book_id does not exist")
    @collection.response(403, "invalid token")
    @collection.response(406, "collection_id does not belong to this user")
    @collection.response(409, "the book is already in the collection")
    def post(self, collection_id, book_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check collection
        collection = util.check_collection(collection_id)
        if collection is None:
            abort(401, "collection_id {} does not exist".format(collection_id))

        # check if the user owns the collection
        if collection.user_id != user.user_id:
            abort(406, "this collection id does not belong to the user")

        # check the book
        book = check_book(book_id)
        if book is None:
            abort(402, "book_id {} does not exist".format(book_id))

        # check if the book is in collection
        if util.is_book_in_collection(collection_id, book_id):
            abort(409, "book is already in collection")

        util.add_book_to_collection(collection_id, book_id)
        return


    @collection.doc("remove a new book from the collection")
    @collection.expect(token_parser)
    @collection.response(200, "success, return nothing")
    @collection.response(400, "bad request")
    @collection.response(401, "collection_id does not exist")
    @collection.response(402, "book_id does not exist")
    @collection.response(403, "invalid token")
    @collection.response(406, "collection_id does not belong to this user")
    @collection.response(409, "the book not in the collection")
    def delete(self, collection_id, book_id):
        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check collection
        collection = util.check_collection(collection_id)
        if collection is None:
            abort(401, "collection_id {} does not exist".format(collection_id))

        # check if the user owns the collection
        if collection.user_id != user.user_id:
            abort(406, "this collection id does not belong to the user")

        # check the book
        book = check_book(book_id)
        if book is None:
            abort(402, "book_id {} does not exist".format(book_id))

        # check if the book is in collection
        if not util.is_book_in_collection(collection_id, book_id):
            abort(409, "book is not in collection")

        util.remove_book_from_collection(collection_id, book_id)
        return
