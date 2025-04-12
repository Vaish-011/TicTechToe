from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["TicTechToe"]

users_collection = db["User"]
skills_collection = db["ExtractedSkills"]
job_collection = db["Jobs"]

print("Connected to MongoDB Atlas successfully!")
