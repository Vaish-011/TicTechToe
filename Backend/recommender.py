from flask import Blueprint, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
import numpy as np
import requests
import os
from dotenv import load_dotenv

from database import users_collection

load_dotenv()
ml_recommender_bp = Blueprint('ml_recommender', __name__)

@ml_recommender_bp.route("/ml-recommended-jobs/<user_id>", methods=["GET"])
def ml_recommend_jobs(user_id):
    # Get user from database
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        return jsonify({"message": "Invalid user ID format"}), 400

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Extract skills and domains from nested structure
    skills = user.get("dashboard", {}).get("skills", [])
    domains = user.get("career", {}).get("domains", "")
    preferred_location = user.get("preferred_location", "")

    print("Skills:", skills)
    print("Domains:", domains)

    user_text = " ".join(skills + domains.split(","))

    # Create job queries
    job_queries = [d.strip() for d in domains.split(",") if d.strip()]
    if not job_queries and skills:
        job_queries = skills

    if not job_queries:
        return jsonify({"message": "No valid domains or skills to generate job queries."}), 400

    # Fetch jobs from API
    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": os.getenv("RAPIDAPI_HOST")
    }

    url = "https://jsearch.p.rapidapi.com/search"
    jobs = []

    for query in job_queries:
        params = {
            "query": query,
            "num_pages": "1"
        }
        if preferred_location:
            params["location"] = preferred_location

        try:
            res = requests.get(url, headers=headers, params=params)
            if res.status_code == 200:
                data = res.json()
                jobs += data.get("data", [])
            else:
                print(f"API Error {res.status_code}: {res.text}")
        except Exception as e:
            print(f"Error fetching jobs for query '{query}': {e}")

    if not jobs:
        return jsonify({"message": "No jobs found."}), 500

    # Vectorize and match jobs
    job_texts = [job.get("job_description", "") + " " + job.get("job_title", "") for job in jobs]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(job_texts + [user_text])

    user_vector = tfidf_matrix[-1]
    job_vectors = tfidf_matrix[:-1]

    similarities = cosine_similarity(user_vector, job_vectors).flatten()
    top_indices = np.argsort(similarities)[::-1][:10]

    recommended_jobs = [jobs[i] for i in top_indices]

    return jsonify({"recommended_jobs": recommended_jobs})
