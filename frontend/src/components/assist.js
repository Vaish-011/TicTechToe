import React, { useEffect, useState } from 'react'

export default function InterviewAssist() {
  const [feedback, setFeedback] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/gesture_feedback')
        .then(res => res.json())
        .then(data => setFeedback(data))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">🧠 AI Interview Coach</h1>

      <div className="flex flex-col lg:flex-row justify-center gap-8 items-center">
        <div className="border-4 border-blue-500 rounded-lg overflow-hidden w-full max-w-xl">
          <img src="http://localhost:5000/video_feed" alt="Webcam" className="w-full" />
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg max-w-md text-left">
          <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
          <ul className="space-y-3">
            <li><strong>Posture:</strong> {feedback.posture}</li>
            <li><strong>Hands:</strong> {feedback.hands}</li>
            <li><strong>Eye Contact:</strong> {feedback.eye_contact}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
