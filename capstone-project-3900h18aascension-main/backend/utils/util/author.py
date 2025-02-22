from flask import abort
from sqlalchemy import func
from math import ceil

from config import db
from db.models import *


def check_author(author_id):
    author = db.session.query(Author).get(author_id)
    return author


# assume the author id is valid
# get author profile, and all his books
def get_author(author_id):
    author = db.session.query(Author).get(author_id)

    # get all books, sort in descending year
    books = db.session.query(Book) \
        .join(BookAuthor, BookAuthor.book_id == Book.book_id) \
        .filter(BookAuthor.author_id == author_id) \
        .order_by(Book.year.desc()) \
        .all()

    # construct the response
    book_list = []

    for b in books:
        authors = db.session.query(Author.author_id, Author.name) \
            .join(BookAuthor, BookAuthor.author_id == Author.author_id) \
            .filter(BookAuthor.book_id == b.book_id) \
            .all()

        authors = [{"author_id": a[0], "name": a[1]} for a in authors]

        b_dict = b.to_dict()
        b_dict["authors"] = authors
        book_list.append(b_dict)


    response = {
        "author": author.to_dict(),
        "books": book_list}

    return response


# get all author names in a list in alphabetical order
def get_author_name_list():
    names = db.session.query(Author.name) \
        .order_by(Author.name.asc()) \
        .all()

    names = [tup[0] for tup in names]
    response = {"names": names}
    return response


# search author
def search_author(params):
    keyword = params["keyword"]
    page_idx = params["page"]
    item_on_page = params["item_on_page"]

    # get limit and offset
    offset = page_idx * item_on_page

    # keyword can be empty
    if len(keyword) == 0:
        print("no keyword")
        num_result = db.session.query(Author).count()

        authors = db.session.query(Author)
    else:
        # lower case keyword
        keyword = keyword.lower()

        num_result = db.session.query(Author) \
            .filter(func.lower(Author.name).contains(keyword)) \
            .count()

        authors = db.session.query(Author) \
            .filter(func.lower(Author.name).contains(keyword))

    # sort, order
    sort = params["sort"]
    order = params["order"]

    if sort == "name":
        if order == "asc":
            authors = authors.order_by(Author.name.asc())
        else:
            authors = authors.order_by(Author.name.desc())
    elif sort == "birthyear":
        if order == "asc":
            authors = authors.order_by(Author.birthyear.asc())
        else:
            authors = authors.order_by(Author.birthyear.desc())

    # convert to list
    authorlist = authors.all()
    total_item = len(authorlist)

    # limit
    authors = authors.limit(item_on_page).offset(offset).all()

    # count how many pages
    total_page = ceil(num_result / item_on_page)

    # convert into dict
    response = {
        "page": page_idx,
        "item_on_page": item_on_page,
        "total_page": total_page,
        "total_item": total_item,
        "authors": [author.to_dict() for author in authors]}

    return response
