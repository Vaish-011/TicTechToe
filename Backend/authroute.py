from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token, JWTManager,jwt_required
from bson import ObjectId
from database import users_collection
import os

auth_bp = Blueprint("auth", __name__)

def setup_jwt(app):
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default-jwt-secret")
    JWTManager(app)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    current_location = data.get("current_location")
    preferred_location = data.get("preferred_location", "")

    if not name or not email or not password or not role or not current_location:
        return jsonify({"message": "All required fields must be filled!"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "Email already registered!"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "current_location": current_location,
        "preferred_location": preferred_location
    })

    return jsonify({"message": "User registered successfully!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and Password are required!"}), 400

    user = users_collection.find_one({"email": email})

    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        access_token = create_access_token(identity=str(user["_id"]))
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid email or password!"}), 401

# # Protected route example
# @auth_bp.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     current_user_id = get_jwt_identity()
#     user = users_collection.find_one({"_id": ObjectId(current_user_id)})
#     if user:
#         return jsonify({"message": f"Hello, {user['name']}!"}), 200
#     else:
#         return jsonify({"message": "User not found"}), 404