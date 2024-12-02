import { useState } from 'react';
import './Forms.css';
import axios from 'axios';

const RegistrationForm = ({ onLoginClick, setShowRegistration }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPasswordValue = event.target.value;
    setConfirmPassword(confirmPasswordValue);
    setPasswordsMatch(confirmPasswordValue === password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password
      });

      console.log(response.data); // Log the response from the server
      setRegistrationSuccess(true); // Set registration success message
      setTimeout(() => {
        setShowRegistration(false);
        setRegistrationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      {registrationSuccess ? (
        <p className="success-message">Registered successfully! You may now login.</p>
      ) : (
        <form onSubmit={handleSubmit} className="registration-form" method="post">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {!passwordsMatch && <p className="error-message">Passwords do not match</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" disabled={!passwordsMatch}>Register</button>
          <p className="login-link" onClick={onLoginClick}>Already have an account? Login</p>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
