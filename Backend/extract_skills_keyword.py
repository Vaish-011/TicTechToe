# backend/extract_skills_keyword.py
import fitz  # PyMuPDF
from load_data import load_skills_from_csv
import re
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from database import skills_collection
from flask import Blueprint, request, jsonify

skills_bp = Blueprint('skills', __name__)

def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text.lower()

def extract_skills_from_resume(pdf_path):
    skills_list = load_skills_from_csv()
    resume_text = extract_text_from_pdf(pdf_path)
    # words_in_resume = set(re.findall(r'\b\w+\b', resume_text))
    matched_skills = [skill for skill in skills_list if skill in resume_text]
    skills_data = {
        "skills": matched_skills,
        "resume_path": pdf_path,
        "extracted_at": datetime.now()  # Include timestamp
    }
    
    # Insert the data into the MongoDB collection
    skills_collection.insert_one(skills_data)
    return list(set(matched_skills))  # Remove duplicates


@skills_bp.route("/api/extracted-skills", methods=["GET"])
def get_extracted_skills():
    latest_entry = skills_collection.find_one(sort=[("extracted_at", -1)])
    if latest_entry:
        return jsonify({
            "skills": latest_entry["skills"],
            "extracted_at": latest_entry["extracted_at"].strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    return jsonify({"message": "No skills extracted yet."}), 404
