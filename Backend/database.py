from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["TicTechToe"]

users_collection = db["User"]
admin_collection = db["Admin"]
trainer_collection = db["Trainer"]
nutritionist_collection = db["Nutritionist"]

print("Connected to MongoDB Atlas successfully!")
