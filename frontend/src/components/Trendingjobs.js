import React, { useEffect, useState } from "react";
import "./trendingjobs.css";

export default function TrendingJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/job/trending-jobs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setJobs(data.data);
        } else {
          console.error("Invalid job data format received.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="trending-jobs-page">
      <h1>🔥 Trending Jobs</h1>
      {loading ? (
        <p className="loading">Loading jobs...</p>
      ) : (
        <div className="job-list">
          {jobs.map((job, index) => (
            <div className="job-card" key={index}>
              <h2>{job.job_title}</h2>
              <p><strong>Company:</strong> {job.employer_name}</p>
              <p><strong>Location:</strong> {job.job_city}, {job.job_country}</p>
              <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer">Apply</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
