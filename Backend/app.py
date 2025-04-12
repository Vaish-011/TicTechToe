import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from authroute import auth_bp,setup_jwt
from dotenv import load_dotenv
from trending_jobs import trending_jobs_bp
from dashboard import dashboard_bp
from recommender import ml_recommender_bp
from course import course_bp
from skill import skill_bp
from job_routes import job_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Secret key config
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default-secret")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default-jwt-secret")
JWTManager(app)

# JWT Setup
setup_jwt(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(trending_jobs_bp,url_prefix='/job')
app.register_blueprint(dashboard_bp)
app.register_blueprint(ml_recommender_bp)
app.register_blueprint(course_bp)
app.register_blueprint(skill_bp, url_prefix="/skills")
app.register_blueprint(job_bp, url_prefix="/jobs")

if __name__ == "__main__":
    app.run(debug=True)
