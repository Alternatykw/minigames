import React, { useState, useEffect } from 'react';
import './Navbar.css';
import FlyoutMenu from './FlyoutMenu';
import LoginForm from './LoginForm';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";


const Navbar = () => {
  const [isFlyoutMenuOpen, setIsFlyoutMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isModalOpen && !event.target.closest('.modal-content')) {
        closeModal();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isModalOpen]);

  const toggleFlyoutMenu = (event) => {
    event.stopPropagation();
    setIsFlyoutMenuOpen(!isFlyoutMenuOpen);
  };

  const closeFlyoutMenu = () => {
    setIsFlyoutMenuOpen(false);
  };

  const openModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalClosing(true); // Set isModalClosing state to trigger closing animation
    setTimeout(() => {
      setIsModalOpen(false); // Close the modal after animation completes
      setIsModalClosing(false); // Reset isModalClosing state
    }, 500); // Adjust the timing to match the animation duration
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the authentication token from localStorage
    if (token) {
      // If token exists, user is logged in
      setIsLoggedIn(true);
      // Fetch user data (username and balance) using the token
      axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUsername(response.data.username);
        setBalance(response.data.balance);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    } else {
      // If token doesn't exist, user is not logged in
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('token');
    // Reset user state
    setUsername('');
    setBalance(0);
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="toggle-button" onClick={toggleFlyoutMenu}>
          Menu
        </button>
      </div>
      <FlyoutMenu isOpen={isFlyoutMenuOpen} onClose={closeFlyoutMenu} />  

      <div className="navbar-right">

      {!isLoggedIn ? (

        <button className="login-button" onClick={openModal}>
          Login / Register
        </button>

      ) : (

      <div className="navbar-right">
        {username} | <FontAwesomeIcon className="icon" icon={faMoneyBill1}/> {balance.$numberDecimal}  &nbsp;
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      )}

      </div>
      {isModalOpen && (
        <div className={`modal-container ${isModalClosing ? 'closing' : ''}`}>
          <div className={`modal-content ${isModalClosing ? 'closing' : ''}`}>
            <LoginForm onClose={closeModal} />
          </div>
        </div>
      )}


    </nav>
  );
};

export default Navbar;
