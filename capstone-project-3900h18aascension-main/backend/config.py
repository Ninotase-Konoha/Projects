from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# follow the tutorial, write in the configuration file
# https://flask-restx.readthedocs.io/en/latest/quickstart.html
app = Flask(__name__)

# add cors layer
CORS(app)

# create api
api = Api(app,
    validate=True,
    title="Book Recommendation System",
    version="1.0",
    description="Book recommendation system backend api server")

# link to database file
dir_path = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(dir_path, "db/database.db")

# check the file exist
if not os.path.exists(db_path):
    print("Download the database.db file from google driver folder")
    print("And put into backend/db folder")
    exit(0)

# link to database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.url_map.strict_slashes = False

# start the database
db = SQLAlchemy(app)
