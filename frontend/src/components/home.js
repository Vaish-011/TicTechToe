import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to Skill Assessment</h2>
      <button onClick={() => navigate('/jobmarket')}>Job Market</button>
      <button onClick={() => navigate('/networkanalysis')}>Network Analysis</button>
      <button onClick={() => navigate('/resumeinterview')}>Resume & Interview</button>
      <button onClick={() => navigate('/personalised')}>Personalised Career</button>
    </div>
  );
}
