from flask import jsonify, request, abort
from flask_restx import Resource

from config import api


goal = api.namespace("goal",
    description="goal system, not finish!!")


@goal.route("/")
class Goal(Resource):
    def get(self):
        pass
