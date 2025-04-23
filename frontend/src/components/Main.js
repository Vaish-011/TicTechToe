import React from 'react'
import { motion } from 'framer-motion'
import './main.css'
import { Link, useNavigate } from 'react-router-dom'

const features = [
  {
    title: 'Explore Jobs',
    path: '/trendingjob',
    className: 'explore',
    description: 'Browse trending tech job openings updated in real-time.',
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    className: 'dashboard',
    description: 'Manage your profile, track applications, and insights.',
  },
  {
    title: 'Recommended Job',
    path: '/recommended',
    className: 'dashboard',
    description: 'Personalized job suggestions based on your skills and interests.',
  },
  {
    title: 'Post Jobs',
    path: '/networkanalysis',
    className: 'dashboard',
    description: 'Post job opportunities and analyze your professional network.',
  },
  {
    title: 'Resume Imporvement Helper',
    path: '/resumeinterview',
    className: 'dashboard',
    description: 'Get resume tips and prepare for interviews with smart tools.',
  },
  {
    title: 'Course Materials',
    path: '/coursematerial',
    className: 'dashboard',
    description: 'Access curated learning resources and tutorials.',
  },
  {
    title: 'Skill',
    path: '/skill',
    className: 'dashboard',
    description: 'Discover in-demand skills and track your progress.',
  },
  {
    title: 'Interview Assist',
    path: '/assist',
    className: 'dashboard',
    description: 'AI-powered mock interviews and feedback to help you ace it.',
  },
  {
    title:'Quiz',
    path:'/quiz',
    className:'dashboard',
    description:'Test your knowledge and prepare for interviews with quizzes.'
  }
]

export default function Main() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Optionally clear auth tokens or session data here
    navigate('/')
  }

  return (
    <div className="main-page">
      <div className="top-bar">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>🚀 Welcome to JobVerse</h1>
        <p>Your gateway to trending tech jobs, curated and real-time.</p>

        <div className="card-container">
          {features.map(({ title, path, className, description }, index) => (
            <Link key={index} to={path} className={`card ${className}`}>
              <h3>{title}</h3>
              <p>{description}</p>
            </Link>
          ))}
        </div>
        <Link to="/suggestjob" className="btn dashboard">Suggest Jobs</Link>
      </motion.div>
    </div>
  )
}
