// frontend/src/components/SkillExtractor.js
import React, { useState } from "react";
import axios from "axios";

const SkillExtractor = () => {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a resume file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/skills/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSkills(response.data.skills);
      console.log(response.data.skills)
    } catch (error) {
      alert("Failed to upload or extract skills.");
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Resume to Extract Skills</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <br />
      <button onClick={handleUpload}>Upload</button>
      <h3>Extracted Skills:</h3>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillExtractor;
