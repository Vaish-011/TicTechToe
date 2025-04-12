import pandas as pd
import os

def load_skills_from_csv():
    file_path = os.path.join(os.path.dirname(__file__), "skills_dataset.csv")
    
    if not os.access(file_path, os.R_OK):
        raise PermissionError(f"Cannot read file: {file_path}")

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        raise Exception(f"Error reading Excel file: {e}")
    
    skills = df.iloc[:, 0].dropna().str.lower().str.strip().tolist()
    return skills
