// components/CourseraCourses.js

import React, { useEffect, useState } from 'react';
import './coursematerial.css';

const CourseraCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourseraCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/coursera');
      const data = await res.json();
      setCourses(data.elements || []);
    } catch (error) {
      console.error("Error fetching Coursera courses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourseraCourses();
  }, []);

  return (
    <div className="coursera-container">
      <h1 className="coursera-title">Popular Coursera Courses</h1>
      {loading ? (
        <p className="loading-text">Loading courses...</p>
      ) : (
        <div className="coursera-grid">
          {courses.map((course) => (
            <div className="coursera-card" key={course.id}>
              <h3 className="course-name">{course.name}</h3>
              <p className="course-type">{course.courseType}</p>
              <a
                href={`https://www.coursera.org/learn/${course.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="course-link"
              >
                Go to Course
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseraCourses;
