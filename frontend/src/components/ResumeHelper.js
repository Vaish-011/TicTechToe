import React, { useState } from 'react';
import axios from 'axios';
import './resumehelper.css';

const ResumeHelper = () => {
  const [file, setFile] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/upload-resume", formData);
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-helper-page">
      <div className="resume-container">
        <h1>🚀 Resume Improvement Helper</h1>

        <div className="upload-section">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>
            {loading ? "Analyzing..." : "Upload"}
          </button>
        </div>

        <p className="hint-text">
          Upload your resume to receive smart suggestions!
        </p>

        {loading && (
          <div className="analyzing-text">Analyzing resume...</div>
        )}

        {suggestions && (
          <div className="suggestions-box">
            <h2>📋 Suggestions</h2>
            <pre>{suggestions}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHelper;
