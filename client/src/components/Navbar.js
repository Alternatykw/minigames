import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import FlyoutMenu from './FlyoutMenu';
import LoginForm from './LoginForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import BalanceModal from './BalanceModal';

const Navbar = ({ isModalOpen, openModal, closeModal, isModalClosing, isLoggedIn, user, handleLogout, modifyBalance}) => {
  const [isFlyoutMenuOpen, setIsFlyoutMenuOpen] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isBalanceClosing, setIsBalanceClosing] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const username = user.username;
  const balance = user.balance;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isModalOpen && !event.target.closest('.modal-content')) {
        closeModal();
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalOpen, closeModal]);
  
  const toggleFlyoutMenu = (event) => {
    event.stopPropagation();
    setIsFlyoutMenuOpen(true);
  };

  const closeFlyoutMenu = () => {
    setIsFlyoutMenuOpen(false);
  };

  const toggleBalanceMenu = (event) => {
    event.stopPropagation();
    setIsBalanceOpen(true);
  }

  const closeBalanceMenu = () => {
    setIsBalanceClosing(true);
    setTimeout(() => {
      setIsBalanceOpen(false);
      setIsBalanceClosing(false);
    }, 500);   
  }
  
  const balanceShort = (balance) => {
    let shortbalance=0;
    if (balance >= 1000 && balance < 1000000){
      shortbalance=(balance / 1000).toFixed(1) + 'K';
    }
    else if (balance >= 1000000){
      shortbalance=(balance/1000000).toFixed(1) + 'M';
    }
    else shortbalance=balance;
    return shortbalance;
  }

  const handleUserDropdown = () => {
    setUserDropdown(!userDropdown);
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
          <div className="balance"><FontAwesomeIcon className="icon" icon={faMoneyBill1}/> {balanceShort(balance)} </div>
          <div className="balance-button" onClick={toggleBalanceMenu}><button>+</button></div>
        </div> 
      )}

      {isBalanceOpen && (
        <div className={`balance-container ${isBalanceClosing ? 'closing' : ''}`} onClick={closeBalanceMenu}>
          <div className={`modal-content ${isBalanceClosing ? 'closing' : ''}`}>
            <BalanceModal modifyBalance={modifyBalance}/>
          </div>
        </div>
      )}

      <div className="navbar-right">

      {!isLoggedIn ? (

        <button className="login-button" onClick={openModal}>
          Login / Register
        </button>

      ) : (

      <div className="navbar-right">
        <div className="user-dropdown" onClick={handleUserDropdown}>
          {username}
          {userDropdown && 

          <div>
              <Link to="/account">
                <button className="user-button">
                  Account
                </button>
              </Link>
              <button className="user-button" onClick={handleLogout}>
                Logout
              </button>
          </div>

          }
        </div>
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
