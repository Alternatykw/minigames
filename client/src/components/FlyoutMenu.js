import React, { useEffect, useState } from 'react';
import './FlyoutMenu.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb, faHouse, faUpLong } from "@fortawesome/free-solid-svg-icons";


const FlyoutMenu = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(() => window.location.pathname.split('/').pop() || 'index');

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
        <ul>
          <li className={isCurrent('index') ? 'darker' : ''}><a href={isCurrent('index') ? "javascript:void(0);" : "/index"}><FontAwesomeIcon icon={faHouse} /> Home page</a></li>
          <li className={isCurrent('bombs') ? 'darker' : ''}><a href={isCurrent('bombs') ? "javascript:void(0);" : "/bombs"}><FontAwesomeIcon icon={faBomb} /> Bombs</a></li>
          <li className={isCurrent('towers') ? 'darker' : ''}><a href={isCurrent('towers') ? "javascript:void(0);" : "/towers"}><FontAwesomeIcon icon={faUpLong} /> Towers</a></li>
          <li className={isCurrent('something') ? 'darker' : ''}><a href="#"> Something something</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FlyoutMenu;
