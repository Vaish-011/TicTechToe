import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import './dashboard.css'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [formData, setFormData] = useState({
    education: { qualification: '', specialization: '', institute: '', year: '' },
    experience: { years: '', past_jobs: '' },
    skills: '',
    career: { domains: '', dream_title: '' },
    socials: { linkedin: '', github: '', portfolio: '' },
    bio: '',
  })

  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      localStorage.setItem('userId', decoded.sub)
      setUserId(decoded.sub)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    fetch(`http://localhost:5000/dashboard/${userId}`)
      .then(res => res.status === 204 ? null : res.json())
      .then(data => {
        if (data?.dashboard) {
          setDashboard(data.dashboard)
        }
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [userId])

  const handleChange = (e, section, field) => {
    const value = e.target.value
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleEditClick = () => {
    if (dashboard) {
      setFormData({
        education: { ...dashboard.education },
        experience: { ...dashboard.experience, past_jobs: dashboard.experience.past_jobs || '' },
        skills: dashboard.skills?.join(', ') || '',
        career: { ...dashboard.career },
        socials: { ...dashboard.socials },
        bio: dashboard.bio || ''
      })
    }
    setEditing(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s)
    const pastJobsArray = formData.experience.past_jobs.split(',').map(j => j.trim()).filter(j => j)

    // Merge with existing data if available
    const mergedData = {
      education: { ...dashboard?.education, ...formData.education },
      experience: {
        years: formData.experience.years || dashboard?.experience.years || '',
        past_jobs: Array.from(new Set([
          ...(dashboard?.experience.past_jobs?.split(',').map(j => j.trim()) || []),
          ...pastJobsArray
        ])).join(', ')
      },
      skills: Array.from(new Set([
        ...(dashboard?.skills || []),
        ...skillsArray
      ])),
      career: { ...dashboard?.career, ...formData.career },
      socials: { ...dashboard?.socials, ...formData.socials },
      bio: formData.bio || dashboard?.bio || ''
    }

    const res = await fetch(`http://localhost:5000/dashboard/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mergedData)
    })

    const result = await res.json()
    alert(result.message)
    setDashboard(mergedData)
    setEditing(false)
  }

  if (loading) return <div>Loading...</div>

  if (dashboard && !editing) {
    return (
      <div className="profile-card">
        <h2>👤 Your Dashboard</h2>

        <div className="section">
          <h3>🎓 Education</h3>
          <p><strong>Qualification:</strong> {dashboard.education.qualification}</p>
          <p><strong>Specialization:</strong> {dashboard.education.specialization}</p>
          <p><strong>Institute:</strong> {dashboard.education.institute}</p>
          <p><strong>Year:</strong> {dashboard.education.year}</p>
        </div>

        <div className="section">
          <h3>💼 Experience</h3>
          <p><strong>Years of Experience:</strong> {dashboard.experience.years}</p>
          <p><strong>Past Jobs:</strong> {dashboard.experience.past_jobs}</p>
        </div>

        <div className="section">
          <h3>🛠️ Skills</h3>
          <ul>
            {dashboard.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>🎯 Career Interests</h3>
          <p><strong>Domains:</strong> {dashboard.career.domains}</p>
          <p><strong>Dream Title:</strong> {dashboard.career.dream_title}</p>
        </div>

        <div className="section">
          <h3>🌐 Socials</h3>
          <p><strong>LinkedIn:</strong> <a href={dashboard.socials.linkedin} target="_blank" rel="noreferrer">{dashboard.socials.linkedin}</a></p>
          <p><strong>GitHub:</strong> <a href={dashboard.socials.github} target="_blank" rel="noreferrer">{dashboard.socials.github}</a></p>
          <p><strong>Portfolio:</strong> <a href={dashboard.socials.portfolio} target="_blank" rel="noreferrer">{dashboard.socials.portfolio}</a></p>
        </div>

        <div className="section">
          <h3>📝 Bio</h3>
          <p>{dashboard.bio}</p>
        </div>

        <button onClick={handleEditClick}>✏️ Edit Profile</button>
      </div>
    )
  }

  return (
    <div className="dashboard-form">
      <h2>{dashboard ? '✏️ Update Your Dashboard' : '📝 Create Your Dashboard'}</h2>
      <form onSubmit={handleSubmit}>
        <h3>🎓 Education</h3>
        <input type="text" placeholder="Qualification" value={formData.education.qualification} onChange={(e) => handleChange(e, 'education', 'qualification')} />
        <input type="text" placeholder="Specialization" value={formData.education.specialization} onChange={(e) => handleChange(e, 'education', 'specialization')} />
        <input type="text" placeholder="Institute" value={formData.education.institute} onChange={(e) => handleChange(e, 'education', 'institute')} />
        <input type="text" placeholder="Year of Passing" value={formData.education.year} onChange={(e) => handleChange(e, 'education', 'year')} />

        <h3>💼 Work Experience</h3>
        <input type="number" placeholder="Years of Experience" value={formData.experience.years} onChange={(e) => handleChange(e, 'experience', 'years')} />
        <input type="text" placeholder="Past Jobs (comma separated)" value={formData.experience.past_jobs} onChange={(e) => handleChange(e, 'experience', 'past_jobs')} />

        <h3>🛠️ Skills</h3>
        <input type="text" placeholder="Skills (comma separated)" value={formData.skills} onChange={(e) => handleChange(e, null, 'skills')} />

        <h3>🎯 Career Interests</h3>
        <input type="text" placeholder="Domains" value={formData.career.domains} onChange={(e) => handleChange(e, 'career', 'domains')} />
        <input type="text" placeholder="Dream Job Title" value={formData.career.dream_title} onChange={(e) => handleChange(e, 'career', 'dream_title')} />

        <h3>🌐 Socials</h3>
        <input type="text" placeholder="LinkedIn" value={formData.socials.linkedin} onChange={(e) => handleChange(e, 'socials', 'linkedin')} />
        <input type="text" placeholder="GitHub" value={formData.socials.github} onChange={(e) => handleChange(e, 'socials', 'github')} />
        <input type="text" placeholder="Portfolio" value={formData.socials.portfolio} onChange={(e) => handleChange(e, 'socials', 'portfolio')} />

        <h3>📝 Bio</h3>
        <textarea placeholder="Your career goals..." value={formData.bio} onChange={(e) => handleChange(e, null, 'bio')}></textarea>

        <button type="submit">Save Dashboard</button>
      </form>
    </div>
  )
}
