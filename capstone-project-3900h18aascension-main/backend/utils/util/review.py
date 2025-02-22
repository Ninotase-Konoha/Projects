from flask import abort

from config import db
from db.models import *


# assume the book id is valid
def get_reviews(book_id):
    records = db.session.query(Review, User) \
        .join(User, User.user_id == Review.user_id) \
        .filter(Review.book_id == book_id) \
        .order_by(Review.created_at.desc(), Review.last_edited_at.desc()) \
        .all()

    # each record is a tuple
    results = []
    for record in records:
        new_dict = {
            "review": record[0].to_dict(),
            "user": record[1].to_dict_safe_info()}

        results.append(new_dict)

    return results


# add the review
# assume the user has read the book
def add_review(user_id, book_id, review, rating):
    record = Review(
        user_id = user_id,
        book_id = book_id,
        review = review,
        rating = rating)

    db.session.add(record)
    db.session.commit()


# check if a review id is real
def check_review(review_id):
    results = db.session.query(Review).get(review_id)
    if len(results) == 0:
        return None

    return results[0]


# update a review
def update_review(review_obj, review, rating):
    review_obj.review = review
    review_obj.rating = rating
    db.session.commit()
    return


# get the review with user profile
def get_review(review_id):
    # since use review_id, only one result
    records = db.session.query(Review, User) \
        .join(User, User.user_id == Review.user_id) \
        .filter(Review.review_id == review_id) \
        .all()

    if len(records) == 0:
        return None

    # take the only result
    record = records[0]

    # convert tuple to dict
    result = {
        "review": record[0].to_dict(),
        "user": record[1].to_dict_safe_info()}

    return result


# assume the review exist
def delete_review(review_id):
    db.session.query(Review) \
        .filter(Review.review_id == review_id) \
        .delete()

    db.session.commit()
    return


# get all reviews of a user
# assume the user_id is valid
def get_user_reviews(user_id):
    records = db.session.query(Review, User, Book) \
        .join(User, Review.user_id == User.user_id) \
        .join(Book, Review.book_id == Book.book_id) \
        .filter(Review.user_id == user_id) \
        .order_by(Review.created_at.desc(), Review.last_edited_at.desc()) \
        .all()

    # each list element is a tuple of 3 objects
    results = []
    for record in records:
        new_dict = {
            "review": record[0].to_dict(),
            "user": record[1].to_dict_safe_info(),
            "book": record[2].to_dict()}

        # for the book, get authors
        authors = db.session.query(Author.author_id, Author.name) \
            .join(BookAuthor, BookAuthor.author_id == Author.author_id) \
            .filter(BookAuthor.book_id == new_dict["book"]["book_id"]) \
            .all()

        authors = [{"author_id": a[0], "name": a[1]} for a in authors]

        new_dict["book"]["authors"] = authors
        results.append(new_dict)

    return results
