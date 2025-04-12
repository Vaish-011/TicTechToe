import React, { useEffect, useState } from 'react';
import './recommend.css'; // optional, for styling

export default function RecommendJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace this with actual user ID from login or localStorage
  const userId = localStorage.getItem('userId') || 'USER_ID_HERE';

  useEffect(() => {
    fetch(`http://localhost:5000/ml-recommended-jobs/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then((data) => {
        setJobs(data.recommended_jobs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="recommend-job-container">
      <h2>💼 Recommended Jobs</h2>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {jobs.length > 0 ? (
        <div className="job-list">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.job_title}</h3>
              <p><strong>Company:</strong> {job.employer_name || 'N/A'}</p>
              <p><strong>Location:</strong> {job.job_city}, {job.job_country}</p>
              <p><strong>Description:</strong> {job.job_description?.slice(0, 200)}...</p>
              <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="apply-btn">Apply Now</a>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No recommendations found.</p>
      )}
    </div>
  );
}
