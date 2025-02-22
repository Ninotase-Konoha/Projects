from flask import abort

from config import db
from db.models import *


# return a list of collections
# assume the user_id is valid
def get_user_collection(user_id):
    # first get a list of collection
    collections = db.session.query(Collection) \
        .filter(Collection.user_id == user_id) \
        .order_by(Collection.created_at.desc()) \
        .all()

    # for each collection, get a list of books
    results = []
    for collection in collections:
        # now query for all books inside
        books = db.session.query(CollectionBook, Book) \
            .join(Book, CollectionBook.book_id == Book.book_id) \
            .filter(CollectionBook.collection_id == collection.collection_id) \
            .order_by(CollectionBook.added_at.desc()) \
            .all()

        # form the result dict
        result = collection.to_dict()
        result["books"] = []

        # tuple of 2 elements
        for book in books:
            authors = db.session.query(Author.author_id, Author.name) \
                .join(BookAuthor, BookAuthor.author_id == Author.author_id) \
                .filter(BookAuthor.book_id == book[1].book_id) \
                .all()

            authors = [{"author_id": a[0], "name": a[1]} for a in authors]

            result_book = {
                "collection_book": book[0].to_dict(),
                "book": book[1].to_dict()}

            result_book["book"]["authors"] = authors

            result["books"].append(result_book)

        # add to result
        results.append(result)

    return results


# create a new empty collection for a user
def create_new_collection(user_id, title, description):
    new_record = Collection(
        user_id = user_id,
        title = title,
        description = description)

    db.session.add(new_record)
    db.session.commit()
    return


# check if the collection exists
def check_collection(collection_id):
    record = db.session.query(Collection).get(collection_id)
    return record


# update the collection, given the obj
def update_collection(collection, title, description):
    collection.title = title
    collection.description = description
    db.session.commit()
    return


# delete the collection records, and all book records within it
def delete_collection(collection_id):
    # first remove all collection books
    db.session.query(CollectionBook) \
        .filter(CollectionBook.collection_id == collection_id) \
        .delete()

    # then remove the collection
    db.session.query(Collection) \
        .filter(Collection.collection_id == collection_id) \
        .delete()

    db.session.commit()
    return


# check if a book is in collection
def is_book_in_collection(collection_id, book_id):
    records = db.session.query(CollectionBook) \
        .filter(CollectionBook.collection_id == collection_id) \
        .filter(CollectionBook.book_id == book_id) \
        .all()

    return len(records) >= 1


# add a book in collection
def add_book_to_collection(collection_id, book_id):
    new_record = CollectionBook(
        collection_id = collection_id,
        book_id = book_id)

    db.session.add(new_record)
    db.session.commit()
    return


# remove a book from collection
def remove_book_from_collection(collection_id, book_id):
    db.session.query(CollectionBook) \
        .filter(CollectionBook.collection_id == collection_id) \
        .filter(CollectionBook.book_id == book_id) \
        .delete()

    db.session.commit()
    return
