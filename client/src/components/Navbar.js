import React, { useState, useEffect } from 'react';
import './Navbar.css';
import FlyoutMenu from './FlyoutMenu';
import LoginForm from './LoginForm';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";


const Navbar = ({ isModalOpen, openModal, closeModal, isModalClosing, isLoggedIn, setIsLoggedIn}) => {
  const [isFlyoutMenuOpen, setIsFlyoutMenuOpen] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUsername(response.data.username);
        setBalance(response.data.balance.$numberDecimal);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setBalance(0);
    setIsLoggedIn(false);
    window.location.reload(false);
  };

  const addBalance = () => {
    let updatedBalance=parseFloat(balance)+100.00;

    const token = localStorage.getItem('token');
    if (token) {
      axios.put('http://localhost:5000/user/modifybalance', {
        username: username,
        balance: updatedBalance
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setBalance(updatedBalance);
      })
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="toggle-button" onClick={toggleFlyoutMenu}>
          Menu
        </button>
      </div>
      <FlyoutMenu isOpen={isFlyoutMenuOpen} onClose={closeFlyoutMenu} />  

      {isLoggedIn && (
        <div className="navbar-middle">
          <div className="balance"><FontAwesomeIcon className="icon" icon={faMoneyBill1}/> {balance} </div>
          <div className="balance-button" onClick={addBalance}><button>+</button></div>
        </div> 
      )}

      <div className="navbar-right">

      {!isLoggedIn ? (

        <button className="login-button" onClick={openModal}>
          Login / Register
        </button>

      ) : (

      <div className="navbar-right">
        {username}
        <button className="logout-button" onClick={handleLogout}> {/*move to flyout menu or profile dropdown*/}
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
