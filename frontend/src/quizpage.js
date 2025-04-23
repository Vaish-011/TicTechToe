import React, { useEffect, useState } from "react";
import axios from "axios";
import './quizpage.css';

function InterviewPrepPage() {
  const [skills, setSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // Store answers for each question

  // Fetch skills on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/extracted-skills")
      .then((res) => {
        setSkills(res.data.skills);
        fetchQuestions(res.data.skills); // Generate questions based on the fetched skills
      })
      .catch((err) => console.error("Failed to fetch skills:", err));
  }, []);

  // Fetch questions from the API for the given skills
  const fetchQuestions = (skills) => {
    axios.post("http://localhost:5000/api/generate-questions", { skills })
      .then((res) => setQuestions(res.data.questions)) // Set the fetched questions to state
      .catch((err) => console.error("Failed to generate questions:", err));
  };

  // Handle answer change
  const handleAnswerChange = (idx, event) => {
    const newAnswers = { ...answers, [idx]: event.target.value };
    setAnswers(newAnswers);
  };

  return (
    <div className="interview-wrapper">
      <div className="interview-form animate-slide">
        <h2>AI-Generated Interview Questions</h2>
        <div>
          {questions.length > 0 ? (
            <ul className="questions-list">
              {questions.map((q, idx) => (
                <li key={idx} className="question-item">
                  <div>
                    <strong>Skill:</strong> {q.skill} <br />
                    <strong>Question:</strong> {q.question}
                  </div>
                  <textarea
                    placeholder="Write your answer here..."
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e)}
                    className="answer-input"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewPrepPage;
