from flask import abort

from config import db
from db.models import User, Review, CollectionBook, UserReadBook, Collection


def get_user(user_id):
    user = db.session.query(User).get(user_id)
    return user


def update_user(user, username, email, avatar, password):
    if username is not None: user.username = username
    if email is not None: user.email = email
    if avatar is not None: user.avatar = avatar
    if password is not None: user.password = password

    db.session.commit()
    return


def delete_user(user_id):
    # there are many tables with the user record
    # remove Review, CollectionBook, UserReadBook, Collection
    # the last is User

    # remove reviews
    db.session.query(Review).filter(Review.user_id == user_id).delete()
    db.session.commit()

    # remove the books in the collection
    collections = db.session.query(Collection) \
        .filter(Collection.user_id == user_id) \
        .all()

    for collection in collections:
        db.session.query(CollectionBook) \
            .filter(CollectionBook.collection_id == collection.collection_id) \
            .delete()
        db.session.commit()

    # then remove the collections
    db.session.query(Collection) \
        .filter(Collection.user_id == user_id) \
        .delete()
    db.session.commit()

    # remove user read book record
    db.session.query(UserReadBook) \
        .filter(UserReadBook.user_id == user_id) \
        .delete()
    db.session.commit()

    user = db.session.query(User).get(user_id)
    db.session.delete(user)
    db.session.commit()
    return
