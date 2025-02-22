from flask import abort
from sqlalchemy import func
from math import ceil

from config import db
from db.models import *


def get_avg_rating(book_id):
    rating = db.session.query(func.avg(Review.rating)) \
        .filter(Review.book_id == book_id) \
        .one()[0]

    if rating is None:
        return None
    else:
        return round(rating, 1)


def get_book(book_id):
    book_record = db.session.query(Book).get(book_id)
    if book_record is None:
        return None

    # the book exist
    # find all reviews
    review_records = db.session.query(Review, User) \
        .join(User, Review.user_id == User.user_id) \
        .filter(Review.book_id == book_record.book_id) \
        .order_by(Review.created_at.desc(), Review.last_edited_at.desc()) \
        .all()

    # find how many people have readed this book
    users_finish_records = db.session.query(User) \
        .join(UserReadBook, UserReadBook.user_id == User.user_id) \
        .filter(UserReadBook.book_id == book_record.book_id) \
        .all()

    # find how many in the collection
    users_collection_records = db.session.query(User) \
        .join(Collection, User.user_id == Collection.collection_id) \
        .join(CollectionBook, Collection.collection_id == CollectionBook.collection_id) \
        .filter(CollectionBook.book_id == book_record.book_id) \
        .all()

    # get the author
    authors = db.session.query(Author) \
        .join(BookAuthor, BookAuthor.author_id == Author.author_id) \
        .filter(BookAuthor.book_id == book_record.book_id) \
        .all()

    # get the book category
    categories = db.session.query(BookCategory.category) \
        .filter(BookCategory.book_id == book_record.book_id) \
        .all()

    categories = [c[0] for c in categories]
    categories = sorted(categories, reverse=False)

    # now to a dictionary
    result = {
        "book": book_record.to_dict(),
        "authors": [a.to_dict() for a in authors],
        "categoreis": categories,
        "reviews": [{"review": r[0].to_dict(), "user": r[1].to_dict_safe_info()} for r in review_records],
        "finish": [r.to_dict() for r in users_finish_records],
        "collection": [r.to_dict() for r in users_collection_records],
        "rating": get_avg_rating(book_id)}

    return result


def search_books(params):
    print(params)

    # get all books, join with the review rating
    # then filter with year
    books = db.session.query(Book, func.avg(Review.rating).label("rating")) \
        .join(Review) \
        .group_by(Book.book_id) \
        .filter(Book.year >= params["from_year"]) \
        .filter(Book.year <= params["to_year"])

    # keyword
    if len(params["keyword"]) > 0:
        keyword = params["keyword"].lower()
        books = books.filter(func.lower(Book.title).contains(keyword))

    # category
    if len(params["category"]) > 0:
        books = books.join(BookCategory, BookCategory.book_id == Book.book_id) \
            .filter(BookCategory.category.in_(params["category"]))

    # sort: year, rating
    if params["sort"] == "year":
        if params["order"] == "asc":
            books = books.order_by(Book.year.asc())
        else:
            books = books.order_by(Book.year.desc())

    elif params["sort"] == "rating":
        if params["order"] == "asc":
            books = books.order_by(func.avg(Review.rating).asc())
        else:
            books = books.order_by(func.avg(Review.rating).desc())

    # convert to a list
    books = books.all()

    # count how many pages
    total_items = len(books)
    total_page = ceil(len(books) / params["item_on_page"])

    # get the selected records
    start_i = params["page"] * params["item_on_page"]
    end_i = (params["page"] + 1) * params["item_on_page"]
    selected_books = books[start_i : end_i]

    # print(selected_books)

    # form the tuple into one dict only
    response_books = []
    for book_tup in selected_books:
        new_dict = book_tup[0].to_dict()
        new_dict["rating"] = book_tup[1]

        # for each book, also find the author
        book_id = new_dict["book_id"]
        authors = db.session.query(Author.author_id, Author.name) \
                    .join(BookAuthor, BookAuthor.author_id == Author.author_id) \
                    .filter(BookAuthor.book_id == book_id) \
                    .all()

        authors = [{"author_id": a[0], "name": a[1]} for a in authors]
        new_dict["authors"] = authors

        # save to the list
        response_books.append(new_dict)

    response = {
        "page": params["page"],
        "item_on_page": params["item_on_page"],
        "total_pages": total_page,
        "total_items": total_items,
        "books": response_books}

    return response


def check_book(book_id):
    book = db.session.query(Book).get(book_id)
    return book


def check_read(user_id, book_id):
    records = db.session.query(UserReadBook) \
        .filter(UserReadBook.user_id == user_id) \
        .filter(UserReadBook.book_id == book_id) \
        .all()

    status = {
        "user_id": user_id,
        "book_id": book_id}

    if len(records) == 0:
        status["status"] = False
        status["finished_at"] = None
    else:
        status["status"] = True
        status["finished_at"] = records[0].finished_at

    return status


# assume that book has not been read yet
def finish_read(user_id, book_id):
    record = UserReadBook(
        user_id = user_id,
        book_id = book_id)

    db.session.add(record)
    db.session.commit()


# get all finished reading books for a user
def get_finished_books(user_id):
    records = db.session.query(UserReadBook, Book) \
        .join(Book, Book.book_id == UserReadBook.book_id) \
        .filter(UserReadBook.user_id == user_id) \
        .order_by(UserReadBook.finished_at.desc()) \
        .all()

    # the result is a tuple
    print(records)
    results = []
    for record in records:
        new_dict = {
            "finish": record[0].to_dict(),
            "book": record[1].to_dict()}

        results.append(new_dict)

    return results


# delete finished book
def delete_finish_book(user_id, book_id):
    # delete finish book record
    db.session.query(UserReadBook) \
        .filter(UserReadBook.user_id == user_id) \
        .filter(UserReadBook.book_id == book_id) \
        .delete()

    # delete review of this book
    db.session.query(Review) \
        .filter(Review.user_id == user_id) \
        .filter(Review.book_id == book_id) \
        .delete()

    db.session.commit()
    return
