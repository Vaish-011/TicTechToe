from flask import Blueprint, request, jsonify
import os
import fitz  # PyMuPDF
import google.generativeai as genai

resume_helper = Blueprint('resume_helper', __name__)

genai.configure(api_key="your api key here")  
@resume_helper.route('/upload-resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filepath = os.path.join('backend/uploads', file.filename)
    file.save(filepath)

    # Extract text from PDF
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()

    # Prompt
    prompt = f"""Here is a resume:\n{text}\n\n
    Please provide suggestions to improve this resume for job applications.
    Ckeck Grammar, spelling, and punctuation.
    Focus on the following aspects:
    - Formatting: Ensure the resume is visually appealing and easy to read.
    - Achievements: Highlight key accomplishments and metrics.
    - Action Verbs: Use strong action verbs to describe responsibilities and achievements.
    - Clarity and Conciseness: Ensure the language is clear and to the point.
    - Avoid generic suggestions. Be specific and actionable.
    - Avoid repeating the same suggestions multiple times.
    """

    # Use Gemini PRO with proper API
    model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
    chat = model.start_chat(history=[])
    response = chat.send_message(prompt)
    cleaned_text = response.text.replace("**", "")
    return jsonify({"suggestions": cleaned_text})

