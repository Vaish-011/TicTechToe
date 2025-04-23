# skill.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from load_data import load_skills_from_csv
from extract_skills_keyword import extract_skills_from_resume  # or whatever your extractor file is

skill_bp = Blueprint("skill_bp", __name__)

@skill_bp.route("/upload-resume", methods=["POST"])
def upload_resume():
    try:
        print(">> Upload route hit")
        uploaded_file = request.files["file"]
        filename = secure_filename(uploaded_file.filename)
        resume_path = os.path.join("uploads", filename)
        uploaded_file.save(resume_path)
        print(f">> Saved uploaded file to {resume_path}")

        skills_list = load_skills_from_csv()
        print(f">> Loaded skills list: {skills_list[:5]}...")

        extracted_skills = extract_skills_from_resume(resume_path)
        print(f">> Extracted skills: {extracted_skills}")

        return jsonify({"skills": extracted_skills})
    
    except Exception as e:
        print(f">> Exception: {e}")
        return jsonify({"error": str(e)}), 500

