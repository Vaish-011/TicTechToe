
// Frontend (JobForm.js)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from './JobForm.module.css'; // Import the CSS module (assuming you renamed your CSS file)

const JobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    skills: "",
    experience: "",
    salary: "",
    employment_type: "",
    description: "",
    apply_link: "",
    user_id: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setJob((prevJob) => ({
        ...prevJob,
        user_id: storedUser._id, // Assuming your user object has an _id from MongoDB
      }));
    }

    const editData = location.state?.job;
    if (editData) {
      setEditing(true);
      setEditId(editData._id);
      setJob({
        title: editData.title || "",
        company: editData.company || "",
        location: editData.location || "",
        skills: editData.skills || "",
        experience: editData.experience || "",
        salary: editData.salary || "",
        employment_type: editData.employment_type || "",
        description: editData.description || "",
        apply_link: editData.apply_link || "",
        user_id: storedUser?._id || editData.user_id || null,
      });
    } else {
      setEditing(false);
      setEditId(null);
      setJob((prevJob) => ({
        ...prevJob,
        user_id: storedUser?._id || null,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const submitJob = async (e) => {
    e.preventDefault();

    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      };

      const jobDataToSend = { ...job, user_id: storedUser._id };

      if (editing && editId) {
        await axios.put(
          `http://localhost:5000/jobs/updatejob/${editId}`,
          jobDataToSend,
          config
        );
        alert("Job updated successfully.");
      } else {
        const response = await axios.post(
          "http://localhost:5000/jobs/postjobs",
          jobDataToSend,
          config
        );
        if (response.status === 201) {
          alert("Job posted successfully.");
        } else {
          alert("Failed to post job.");
          console.error("Post job response:", response);
        }
      }

      setJob({
        title: "",
        company: "",
        location: "",
        skills: "",
        experience: "",
        salary: "",
        employment_type: "",
        description: "",
        apply_link: "",
        user_id: null,
      });

      setEditing(false);
      setEditId(null);
      navigate("/"); // Or navigate to the job list page
    } catch (error) {
      console.error("Error submitting job:", error);
      if (error.response && error.response.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else {
        alert("Something went wrong while submitting the job.");
      }
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2 className={styles.h2}>{editing ? "Edit Job" : "Post a New Job"}</h2>
      <form onSubmit={submitJob} className={styles.form}>
        <input
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className={styles.input}
        />
        <input
          name="company"
          value={job.company}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className={styles.input}
        />
        <input
          name="location"
          value={job.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className={styles.input}
        />
        <input
          name="skills"
          value={job.skills}
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
          className={styles.input}
        />
        <input
          name="experience"
          value={job.experience}
          onChange={handleChange}
          placeholder="Experience (in years)"
          className={styles.input}
        />
        <input
          name="salary"
          value={job.salary}
          onChange={handleChange}
          placeholder="Salary"
          className={styles.input}
        />
        <input
          name="employment_type"
          value={job.employment_type}
          onChange={handleChange}
          placeholder="Employment Type (e.g. Full-time)"
          className={styles.input}
        />
        <input
          name="apply_link"
          value={job.apply_link}
          onChange={handleChange}
          placeholder="Apply Link"
          className={styles.input}
        />
        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Job Description"
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>
          {editing ? "Update Job" : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;