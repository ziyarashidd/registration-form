import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear success message on new attempt

    try {
      // Send login request with email, username, and password
      const response = await axios.post('http://localhost:4000/api/v1/login', {
        email,
        username,
        password,
      });

      console.log('Login successful:', response.data);
      
      // Update success message on successful login
      setSuccessMessage('Login successful!');
      
      // Handle successful login: Save token, etc.
      
      // Redirect to the desired page after successful login
      window.location.href = 'http://localhost:8080/';  // Use window.location.href for external URL

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Login failed:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      {/* Show success message if login is successful */}
      {successMessage && <p className="success">{successMessage}</p>}
      
      {/* Show error message if there's an error */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
