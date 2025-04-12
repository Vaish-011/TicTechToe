# Backend (job_routes.py)
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from database import job_collection
from bson.objectid import ObjectId

job_bp = Blueprint('job_bp', __name__)

@job_bp.route("/postjobs", methods=["POST"])
@jwt_required()
def post_job():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not all(data.get(field) for field in ["title", "company", "location"]):
        return jsonify({"message": "Missing required fields (title, company, location)"}), 400

    job = {
        "title": data.get("title"),
        "company": data.get("company"),
        "location": data.get("location"),
        "skills": data.get("skills", ""),
        "experience": data.get("experience", ""),
        "salary": data.get("salary", ""),
        "employment_type": data.get("employment_type", ""),
        "description": data.get("description", ""),
        "apply_link": data.get("apply_link", ""),
        "user_id": current_user_id,
        "created_at": datetime.utcnow()
    }

    inserted_job = job_collection.insert_one(job)
    inserted_id = str(inserted_job.inserted_id)
    posted_job = job_collection.find_one({"_id": inserted_job.inserted_id})
    posted_job['_id'] = str(posted_job['_id'])  # Convert ObjectId to string

    return jsonify({"message": "Job posted successfully", "job": posted_job}), 201


@job_bp.route("/getjobs", methods=["GET"])
def get_all_jobs():
    jobs_cursor = job_collection.find()
    jobs_list = []
    for job in jobs_cursor:
        job['_id'] = str(job['_id'])
        jobs_list.append(job)
    return jsonify(jobs_list), 200


@job_bp.route("/updatejob/<string:job_id>", methods=["PUT"])
@jwt_required()
def update_job(job_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    try:
        object_id = ObjectId(job_id)
    except Exception:
        return jsonify({"message": "Invalid job ID format"}), 400

    existing_job = job_collection.find_one({"_id": object_id})
    if not existing_job:
        return jsonify({"message": "Job not found"}), 404

    if existing_job.get("user_id") != current_user_id:
        return jsonify({"message": "You are not authorized to update this job"}), 403

    updated_data = {k: v for k, v in data.items() if v is not None}
    updated_job = job_collection.update_one({"_id": object_id}, {"$set": updated_data})

    if updated_job.modified_count > 0:
        updated_job_data = job_collection.find_one({"_id": object_id})
        updated_job_data['_id'] = str(updated_job_data['_id'])
        return jsonify({"message": "Job updated", "job": updated_job_data}), 200
    else:
        return jsonify({"message": "No changes made to the job"}), 200


@job_bp.route("/deletejob/<string:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job(job_id):
    current_user_id = get_jwt_identity()
    try:
        object_id = ObjectId(job_id)
    except Exception:
        return jsonify({"message": "Invalid job ID format"}), 400

    existing_job = job_collection.find_one({"_id": object_id})
    if not existing_job:
        return jsonify({"message": "Job not found"}), 404

    if existing_job.get("user_id") != current_user_id:
        return jsonify({"message": "You are not authorized to delete this job"}), 403

    deleted_job = job_collection.delete_one({"_id": object_id})

    if deleted_job.deleted_count > 0:
        return jsonify({"message": "Job deleted"}), 200
    else:
        return jsonify({"message": "Failed to delete job"}), 500