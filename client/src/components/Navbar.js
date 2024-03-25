import React, { useState, useEffect } from 'react';
import './Navbar.css';
import FlyoutMenu from './FlyoutMenu';
import LoginForm from './LoginForm';

const Navbar = () => {
  const [isFlyoutMenuOpen, setIsFlyoutMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false); // Define isModalClosing state

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
    document.body.classList.add('modal-open'); // Add modal-open class to body
  };

  const closeModal = () => {
    setIsModalClosing(true); // Set isModalClosing state to trigger closing animation
    document.body.classList.remove('modal-open'); // Remove modal-open class from body
    setTimeout(() => {
      setIsModalOpen(false); // Close the modal after animation completes
      setIsModalClosing(false); // Reset isModalClosing state
    }, 500); // Adjust the timing to match the animation duration
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
        <button className="login-button" onClick={openModal}>
          Login / Register
        </button>
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
