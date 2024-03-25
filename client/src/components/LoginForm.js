import React, { useState } from 'react';
import './LoginForm.css';
import RegistrationForm from './RegistrationForm';

const LoginForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    onClose();
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
      <form onSubmit={handleSubmit} className={`login-form ${showRegistration ? 'hide' : ''}`}>
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
        <p onClick={handleRegisterClick} className="register-link">
          Don't have an account? Register
        </p>
      </form>
      <RegistrationForm onClose={handleCloseRegistration} 
       onLoginClick={() => setShowRegistration(false)}
      />
      
    </div>
  );
};

export default LoginForm;
