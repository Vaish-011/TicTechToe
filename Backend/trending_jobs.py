from flask import Blueprint, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

trending_jobs_bp = Blueprint('trending_jobs', __name__)

@trending_jobs_bp.route('/trending-jobs', methods=['GET'])
def get_trending_jobs():
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {
        "query": "Software Engineer",
        "num_pages": "1"
    }

    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": os.getenv("RAPIDAPI_HOST")
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code == 200:
            data = response.json()
            if "data" in data and isinstance(data["data"], list):
                return jsonify({"data": data["data"]}), 200
            else:
                return jsonify({"message": "Invalid job data format received."}), 500
        else:
            print("API Error:", response.status_code, response.text)
            return jsonify({"message": "Failed to fetch jobs"}), 500
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500
