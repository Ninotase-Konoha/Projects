import secrets

from config import db
from db.models import User


def get_user(email, password):
    user = db.session.query(User) \
            .filter(User.email == email) \
            .filter(User.password == password) \
            .first()

    return user


def login_user(user):
    while True:
        token = secrets.token_urlsafe(nbytes=20)

        # check if the token exist in db or not
        user_check = db.session.query(User) \
                        .filter(User.token == token) \
                        .all()

        if len(user_check) == 0:
            break

    # use this token
    user.token = token
    db.session.commit()

    # get the response
    return user.to_dict()


def is_email_unique(email):
    users = db.session.query(User) \
            .filter(User.email == email) \
            .all()

    return len(users) == 0


def is_username_unique(username):
    users = db.session.query(User) \
                .filter(User.username == username) \
                .all()

    return len(users) == 0


def signup_user(username, email, password, avatar):
    new_user = User(
        username = username,
        password = password,
        email = email,
        avatar = avatar)

    db.session.add(new_user)
    db.session.commit()
    return new_user


def check_token(token):
    if token is None:
        return None

    token_list = token.split(" ", 1)
    if len(token_list) != 2:
        return None

    if token_list[0] != "Bearer":
        return None

    print(token_list)
    token = token_list[1]

    # look for this token in db
    users = db.session.query(User) \
            .filter(User.token == token) \
            .all()

    if len(users) == 1:
        return users[0]

    return None
