from flask import Blueprint, request, jsonify
import bcrypt
from bson import ObjectId
from database import users_collection
from flask import Flask, jsonify

course_bp = Blueprint("course", __name__)


@course_bp.route('/api/coursera', methods=['GET'])
def get_coursera_courses():
    try:
        response = request.get('https://api.coursera.org/api/courses.v1')
        response.raise_for_status()
        return jsonify(response.json())
    except request.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to fetch Coursera data', 'details': str(e)}), 500