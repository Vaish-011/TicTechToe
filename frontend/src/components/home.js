import React from 'react';
import { useNavigate } from 'react-router-dom';
import SkillExtractor from "./SkillExtractor";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to Skill Assessment</h2>
      <button onClick={() => navigate('/recommended')}>Job Market</button>
      <button onClick={() => navigate('/networkanalysis')}>Network Analysis</button>
      <button onClick={() => navigate('/resumeinterview')}>Resume & Interview</button>
      <button onClick={() => navigate('/personalised')}>Personalised Career</button>
      <button onClick={() => navigate('/create')}>Create Account</button>
      <button onClick={() => navigate('/trendingjob')}>Trending Jobs</button>
      <button onClick={() => navigate("/coursematerial")}>📚 Course Materials</button>
      <button onClick={() => navigate('/skill')}>Skill</button>
      
    </div>
  );
}
