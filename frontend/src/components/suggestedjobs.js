// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import styles from './SuggestedJobs.module.css'; // Create this CSS module

// const SuggestedJobs = () => {
//   const [suggestedJobs, setSuggestedJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSuggestedJobs = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await axios.get("http://localhost:5000/jobs/suggested", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuggestedJobs(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching suggested jobs:", error);
//         setError("Failed to fetch suggested jobs.");
//         setLoading(false);
//       }
//     };

//     fetchSuggestedJobs();
//   }, []);

//   if (loading) {
//     return <div>Loading recommended jobs...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (suggestedJobs.length === 0) {
//     return <div>No job recommendations based on your skills yet. Update your skills to see relevant jobs.</div>;
//   }

//   return (
//     <div className={styles['suggested-jobs-container']}>
//       <h2 className={styles.h2}>Recommended Jobs For You</h2>
//       {suggestedJobs.map((job) => (
//         <div key={job._id} className={styles['job-card']}>
//           <h3>{job.title}</h3>
//           <p><strong>Company:</strong> {job.company}</p>
//           <p><strong>Location:</strong> {job.location}</p>
//           <p><strong>Skills:</strong> {job.skills ? job.skills.join(", ") : "N/A"}</p>
//           <p><strong>Experience:</strong> {job.experience || "N/A"}</p>
//           <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
//           <p><strong>Employment Type:</strong> {job.employment_type || "N/A"}</p>
//           <p><strong>Description:</strong> {job.description ? job.description.substring(0, 100) + "..." : "N/A"}</p>
//           {job.apply_link && (
//             <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className={styles['apply-link']}>
//               Apply Now
//             </a>
//           )}
//           {/* You can add a Link to a detailed job page if you have one */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SuggestedJobs;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './SuggestedJobs.module.css'; // Create this CSS module

const SuggestedJobs = () => {
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuggestedJobs = async () => {
      const token = localStorage.getItem("token");
      console.log(token)
      try {
        const response = await axios.get("http://localhost:5000/jobs/suggested", { // Corrected URL
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestedJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching suggested jobs:", error);
        setError("Failed to fetch suggested jobs.");
        setLoading(false);
      }
    };

    fetchSuggestedJobs();
  }, []);

  if (loading) {
    return <div>Loading recommended jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (suggestedJobs.length === 0) {
    return <div>No job recommendations based on your skills yet. Update your skills to see relevant jobs.</div>;
  }

  return (
    <div className={styles['suggested-jobs-container']}>
      <h2 className={styles.h2}>Recommended Jobs For You</h2>
      {suggestedJobs.map((job) => (
        <div key={job._id} className={styles['job-card']}>
          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Skills:</strong> {job.skills ? job.skills.join(", ") : "N/A"}</p>
          <p><strong>Experience:</strong> {job.experience || "N/A"}</p>
          <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
          <p><strong>Employment Type:</strong> {job.employment_type || "N/A"}</p>
          <p><strong>Description:</strong> {job.description ? job.description.substring(0, 100) + "..." : "N/A"}</p>
          {job.apply_link && (
            <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className={styles['apply-link']}>
              Apply Now
            </a>
          )}
          {/* You can add a Link to a detailed job page if you have one */}
        </div>
      ))}
    </div>
  );
};

export default SuggestedJobs;