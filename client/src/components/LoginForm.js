import { useState } from 'react';
import './Forms.css';
import RegistrationForm from './RegistrationForm';
import axios from 'axios';

const LoginForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      window.location.reload(false);
    } catch (error) {
      console.error('Error logging in:', error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleRegisterClick = (event) => {
    event.stopPropagation();
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    onClose();
  };

  return (
    <div className={`login-container ${showRegistration ? 'registration-open' : ''}`}>
      <form onSubmit={handleSubmit} method="post" className={`login-form ${showRegistration ? 'hide' : ''}`}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p onClick={handleRegisterClick} className="register-link">
          Don't have an account? Register
        </p>
      </form>
      <RegistrationForm onClose={handleCloseRegistration} 
       setShowRegistration={setShowRegistration}
       onLoginClick={() => setShowRegistration(false)}
      />
      
    </div>
  );
};

export default LoginForm;
