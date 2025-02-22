from flask import jsonify, request, abort
from flask_restx import Resource

from config import api
import utils.model.review as model
import utils.util.review as util
from utils.model.auth import token_parser
from utils.util.auth import check_token, is_email_unique, is_username_unique
from utils.util.user import get_user
from utils.util.book import check_book, check_read


review = api.namespace("review",
    description="add review, edit review, delete review")


@review.route("/book/<int:book_id>")
@review.doc(params={"book_id": "integer book id"})
class BookReview(Resource):
    @review.doc(description="get all reviews of a book, sort by time")
    @review.response(200, "success")
    @review.response(400, "bad request")
    @review.response(401, "book_id does not exist")
    def get(self, book_id):
        book = check_book(book_id)
        if book is None:
            abort(401, "book_id {} does not exist".format(book_id))

        response = util.get_reviews(book_id)
        return jsonify(response)


    @review.doc(description="post a new view under this book, the user must have read the book first")
    @review.expect(token_parser, model.review_model)
    @review.response(200, "success, nothing return")
    @review.response(400, "bad request")
    @review.response(401, "book_id does not exist")
    @review.response(403, "invalid token")
    @review.response(406, "the user has not read the book yet")
    def post(self, book_id):
        book = check_book(book_id)
        if book is None:
            abort(401, "book_id {} does not exist".format(book_id))

        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check if the user has read the book
        status = check_read(user.user_id,book_id)
        if status["status"] == False:
            abort(406, "the user has not finished this book yet")

        # get the data
        data = request.json
        review = data["review"]
        rating = data["rating"]

        # user and book check out, now create the review
        util.add_review(user.user_id, book_id, review, rating)
        return


@review.route("/<int:review_id>")
@review.doc(params={"review_id": "integer review id"})
class EachReview(Resource):
    @review.doc(description="the review owner can edit this review")
    @review.expect(token_parser, model.review_model)
    @review.response(200, "success")
    @review.response(400, "bad request")
    @review.response(401, "the review_id does not exist")
    @review.response(403, "invalid token")
    @review.response(406, "the review does not belong to this user")
    def put(self, review_id):
        review = util.check_review(review_id)
        if review is None:
            abort(401, "review_id {} does not exist".format(review_id))

        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check if the user owns the review
        if user.user_id != review.user_id:
            abort(406, "the review does not belong to this user")

        # now update the review
        data = request.json()
        util.update_review(review, data["review"], data["rating"])
        return


    @review.doc(description="the review owner can delete this review")
    @review.response(200, "success")
    @review.response(400, "bad request")
    @review.response(401, "the review_id does not exist")
    @review.response(403, "invalid token")
    @review.response(406, "the review does not belong to this user")
    def delete(self, review_id):
        review = util.check_review(review_id)
        if review is None:
            abort(401, "review_id {} does not exist".format(review_id))

        token = request.headers.get("Authorization")
        user = check_token(token)
        if user is None:
            abort(403, "invalid token")

        # check if the user owns the review
        if user.user_id != review.user_id:
            abort(406, "the review does not belong to this user")

        # delete this review
        util.delete_review(review_id)
        return


    @review.doc(description="get one review")
    @review.response(200, "success")
    @review.response(400, "bad request")
    @review.response(401, "review_id does not exist")
    def get(self, review_id):
        response = util.get_review(review_id)

        if response is None:
            abort(401, "review_id {} does not exist".format(review_id))

        return jsonify(response)


@review.route("/user/<int:user_id>")
@review.doc(params={"user_id": "integer user id"})
class UserReview(Resource):
    @review.doc(description="get all reviews of this user, sort by time")
    @review.response(200, "success")
    @review.response(400, "bad request")
    @review.response(401, "user_id does not exist")
    def get(self, user_id):
        user = get_user(user_id)
        if user is None:
            abort(401, "user_id {} does not exist".format(user_id))

        response = util.get_user_reviews(user_id)
        return jsonify(response)
