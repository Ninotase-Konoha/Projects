from flask import jsonify, request, abort
from flask_restx import Resource

from config import api
import utils.model.author as model
import utils.util.author as util


author = api.namespace("author",
            description="find author & all books, search author")


@author.route("/<int:author_id>")
@author.doc(params={"author_id": "author id integer"})
class AuthorGetWithId(Resource):
    @author.doc(description="get author info and all his/her books with author id")
    @author.response(200, "success")
    @author.response(400, "bad request")
    @author.response(401, "author id does not exist")
    def get(self, author_id):
        author = util.check_author(author_id)
        if author is None:
            abort(401, "author_id {} does not exist".format(author_id))

        response = util.get_author(author_id)
        return jsonify(response)


@author.route("/search")
class AllAuthors(Resource):
    @author.doc(description="search by keywords, with page setting")
    @author.expect(model.search_author_model)
    @author.response(200, "success")
    @author.response(400, "bad request")
    def post(self):
        params = request.json
        response = util.search_author(params)
        return jsonify(response)


@author.route("/all_names")
class AllAuthors(Resource):
    @author.doc(description="""
        get all author names in a list,
        used for frontend search bar autocomplete""")
    @author.response(200, "success")
    def get(self):
        # get all author names, (around 4000),
        # in alphabetical order
        response = util.get_author_name_list()
        return jsonify(response)
