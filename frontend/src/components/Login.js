import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Login successful!');
        localStorage.setItem('token', data.access_token);
        navigate('/main');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form animate-slide" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email address"
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

        <button type="submit" className="btn">Login</button>

        <p className="bottom-text">
          Don't have an account?{" "}
          <span onClick={() => navigate('/create')} className="link">
            Create one
          </span>
        </p>
      </form>
    </div>
  );
}
