import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './FlyoutMenu.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb, faHouse, faUpLong, faDice, faAward, faRecordVinyl } from "@fortawesome/free-solid-svg-icons";


const FlyoutMenu = ({ isOpen, onClose }) => {
  const [currentPage] = useState(() => window.location.pathname.split('/').pop());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.flyout-menu')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const isCurrent = (itemName) => {
    return currentPage === itemName;
  };

  return (
    <div>
      {isOpen && <div className="overlay" onClick={onClose}></div>}
      <div className={`flyout-menu ${isOpen ? 'open' : ''}`}>
        <h1 onClick={onClose}>Dashboard</h1>
        <ul>
          <li className={isCurrent('') ? 'darker' : ''}>
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} fixedWidth/> Home page
            </Link>
          </li>
          <li className={isCurrent('bombs') ? 'darker' : ''}>
            <Link to="/bombs">
              <FontAwesomeIcon icon={faBomb} fixedWidth/> Bombs
            </Link>
          </li>
          <li className={isCurrent('towers') ? 'darker' : ''}>
            <Link to="/towers">
              <FontAwesomeIcon icon={faUpLong} fixedWidth/> Towers
            </Link>
          </li>
          <li className={isCurrent('dice') ? 'darker' : ''}>
            <Link to="/dice">
              <FontAwesomeIcon icon={faDice} fixedWidth/> Dice
            </Link>
          </li>
          <li className={isCurrent('roulette') ? 'darker' : ''}>
            <Link to="/roulette">
              <FontAwesomeIcon icon={faRecordVinyl} fixedWidth/> Roulette
            </Link>
          </li>
          <li className={isCurrent('leaderboard') ? 'darker' : ''}>
            <Link to="/leaderboard">
              <FontAwesomeIcon icon={faAward} fixedWidth/> Leaderboard
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FlyoutMenu;
