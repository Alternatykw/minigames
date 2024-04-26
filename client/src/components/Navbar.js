import React, { useState, useEffect } from 'react';
import './Navbar.css';
import FlyoutMenu from './FlyoutMenu';
import LoginForm from './LoginForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";

const Navbar = ({ isModalOpen, openModal, closeModal, isModalClosing, isLoggedIn, username, balance, handleLogout, modifyBalance}) => {
  const [isFlyoutMenuOpen, setIsFlyoutMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isModalOpen && !event.target.closest('.modal-content')) {
        closeModal();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isModalOpen, closeModal]);
  
  const toggleFlyoutMenu = (event) => {
    event.stopPropagation();
    setIsFlyoutMenuOpen(!isFlyoutMenuOpen);
  };

  const closeFlyoutMenu = () => {
    setIsFlyoutMenuOpen(false);
  };

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
          <div className="balance-button" onClick={() => modifyBalance(100)}><button>+</button></div>
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
