from config import app
from apis import auth, author, book, collection, review, user, recommendation, goal


if __name__ == "__main__":
    app.run(debug=True)
