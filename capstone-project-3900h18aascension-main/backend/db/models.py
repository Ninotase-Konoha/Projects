from datetime import datetime
from config import db


class User(db.Model):
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    avatar = db.Column(db.Text)
    token = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        # no password
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        result.pop("password", None)
        return result

    def to_dict_safe_info(self):
        # no password
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        result.pop("password", None)
        result.pop("token", None)
        return result


class Book(db.Model):
    __tablename__ = "book"
    __table_args__ = {'extend_existing': True}

    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    publisher = db.Column(db.String)
    year = db.Column(db.Integer)
    pageCount = db.Column(db.Integer)
    thumbnail = db.Column(db.Text)
    description = db.Column(db.String)
    isbn = db.Column(db.String)
    language = db.Column(db.String)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class BookCategory(db.Model):
    __tablename__ = "book_category"
    __table_args__ = {'extend_existing': True}

    record_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("book.book_id"), nullable=False)
    category = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Collection(db.Model):
    __tablename__ = "collection"
    __table_args__ = {'extend_existing': True}

    collection_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class CollectionBook(db.Model):
    __tablename__ = "collection_book"
    __table_args__ = {'extend_existing': True}

    record_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("book.book_id"), nullable=False)
    collection_id = db.Column(db.Integer, db.ForeignKey("collection.collection_id"), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class UserReadBook(db.Model):
    __tablename__ = "user_read_book"
    __table_args__ = {'extend_existing': True}

    record_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("book.book_id"), nullable=False)
    finished_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class Review(db.Model):
    __tablename__ = "review"
    __table_args__ = {'extend_existing': True}

    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("book.book_id"), nullable=False)
    review = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    last_edited_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Author(db.Model):
    __tablename__ = "author"
    __table_args__ = {'extend_existing': True}

    author_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    birthyear = db.Column(db.Integer)
    photo = db.Column(db.Text)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class BookAuthor(db.Model):
    __tablename__ = "book_author"
    __table_args__ = {'extend_existing': True}

    record_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("book.book_id"), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("book.book_id"), nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
