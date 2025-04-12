from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from database import users_collection



dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/<user_id>", methods=["GET"])
def get_dashboard(user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        return jsonify({"message": "Invalid user ID"}), 400

    if not user:
        return '', 204

    dashboard = user.get("dashboard")
    if not dashboard:
        return '', 204

    return jsonify({"dashboard": dashboard}), 200

@dashboard_bp.route("/dashboard/<user_id>", methods=["POST"])
def update_dashboard(user_id):
    try:
        dashboard_data = request.json
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"dashboard": dashboard_data}}
        )
        if result.modified_count > 0:
            return jsonify({"message": "Dashboard updated successfully"}), 200
        else:
            return jsonify({"message": "Dashboard not updated"}), 200
    except Exception as e:
        return jsonify({"message": f"Error updating dashboard: {str(e)}"}), 500
