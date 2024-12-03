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
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
    setPasswordsMatch(passwordValue === confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPasswordValue = event.target.value;
    setConfirmPassword(confirmPasswordValue);
    setPasswordsMatch(confirmPasswordValue === password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/register', {
        username,
        email,
        password
      });
      setRegistrationSuccess(true); 
      setTimeout(() => {
        setShowRegistration(false);
        setRegistrationSuccess(false);
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }
      else{
        setErrorMessage("The server is currently unavailable, please try again later.")
      }
    }
    setLoading(false);
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
          <button type="submit" disabled={loading || !passwordsMatch}>
            {loading ? <div className="spinner"></div> : 'Register'}
          </button>
          {!passwordsMatch && <p className="error-message">Passwords do not match</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="login-link" onClick={onLoginClick}>Already have an account? Login</p>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
