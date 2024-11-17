import React, { useState } from 'react';

function SignUp() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to validate the email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to validate password strength
  const validatePassword = (password) => {
    // Example: password must be at least 6 characters long
    return password.length >= 6;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Validate fields
    if (!user || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required!');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    // Prepare the data to be sent to the API
    const signUpData = {
      name: user,
      email: email,
      password: password,
    };

    try {
      setLoading(true); // Set loading to true when API call starts

      const response = await fetch(process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

       // Redirect to the desired page after successful login
       window.location.href = 'http://localhost:8080/';  // Use window.location.href for external URL
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Sign up successful!');
        // Optionally, reset the form fields
        setUser('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.message || 'An error occurred during sign-up.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after API call ends
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <div>
          <label>User Name:</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
