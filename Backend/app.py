import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from authroute import auth_bp,setup_jwt
from dotenv import load_dotenv

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

if __name__ == "__main__":
    app.run(debug=True)
