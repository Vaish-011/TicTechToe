import React from 'react'
import { motion } from 'framer-motion'
import './main.css'
import { Link } from 'react-router-dom'

export default function Main() {
  return (
    <div className="main-page">
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>🚀 Welcome to JobVerse</h1>
        <p>Your gateway to trending tech jobs, curated and real-time.</p>

        <div className="cta-buttons">
          <Link to="/trending-jobs" className="btn explore">Explore Jobs</Link>
          <Link to="/login" className="btn login">Login</Link>
          <Link to="/dashboard" className="btn dashboard">Go to Dashboard</Link>
          <Link to="/recommended" className="btn dashboard">Go to Recommended Job</Link>
          <Link to="/networkanalysis" className="btn dashboard">Post Jobs</Link>
        </div>
      </motion.div>
    </div>
  )
}
