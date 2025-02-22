from flask import jsonify, request, abort
from flask_restx import Resource

from config import api


reco = api.namespace("recommendation",
    description="recommendation system, not finish!!")


@reco.route("/")
class Recommendation(Resource):
    def get(self):
        pass
