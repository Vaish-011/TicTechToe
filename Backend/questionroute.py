from flask import Blueprint, request, jsonify
import random

questions_bp = Blueprint("questions_bp", __name__)

@questions_bp.route("/api/generate-questions", methods=["POST"])
def generate_questions():
    data = request.get_json()
    skills = data.get("skills", [])

    if not skills:
        return jsonify({"error": "No skills provided."}), 400
 
    # Pick 3 random unique skills or less if fewer are provided
    selected_skills = random.sample(skills, min(3, len(skills)))

    # Placeholder questions for each skill
    questions_dict = {
        "What is a common use case for": [],
        "Explain a key concept in": [],
        "Name one tool or framework associated with": [],
    }

    questions = []
    
    for skill in selected_skills:
        # Select one random question type for each skill
        question_type = random.choice(list(questions_dict.keys()))
        question = f"{question_type} {skill}?"
        questions.append({
            "skill": skill,
            "question": question
        })

    return jsonify({"questions": questions})
