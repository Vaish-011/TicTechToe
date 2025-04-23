import React, { useState } from 'react';
import './createaccount.css';
import { useNavigate } from 'react-router-dom'; // Add this

export default function CreateAccount() {
  const navigate = useNavigate(); // For navigation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    current_location: '',
    preferred_location: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Account created successfully! You can now login.');
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
          current_location: '',
          preferred_location: '',
        });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Error creating account. Please try again later.');
      console.error(err);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/'); 
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role/Goal (e.g., Student, Job Seeker)"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="current_location"
          placeholder="Current Location"
          value={formData.current_location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="preferred_location"
          placeholder="Preferred Job Location (optional)"
          value={formData.preferred_location}
          onChange={handleChange}
        />
        <button type="submit">Create Account</button>
      </form>

      {/* Login button */}
      <p>Already have an account?</p>
      <button onClick={handleLoginRedirect}>Go to Login</button>
    </div>
  );
}
