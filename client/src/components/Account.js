import React, { useState } from 'react';
import AccountModal from './AccountModal';
import './Account.css';

const Account = ({ user }) => {
  const [action, setAction] = useState('');
  const [isAccountClosing, setIsAccountClosing] = useState(false);

  const closeAccountModal = () => {
    setIsAccountClosing(true);
    setTimeout(() => {
      setAction('');
      setIsAccountClosing(false);
    }, 500);   
  }

  const formatEmail = (email) => {
    const atIndex = email.indexOf('@');
    const localPart = email.substring(0, atIndex);
    const domainPart = email.substring(atIndex);

    if (localPart.length > 6) {
      const maskedLocalPart = `${localPart.slice(0, 4)}****${localPart.slice(-2)}`;
      return maskedLocalPart + domainPart;
    }else {
      const maskedLocalPart = `${localPart.slice(0, 1)}****${localPart.slice(-1)}`;
      return maskedLocalPart + domainPart;
    }
  };

  const formatProfit = (profit) => {
    if (profit === '-' || profit === null || profit === undefined) return '-';
  
    const num = Number(profit);
    if (isNaN(num)) return '-';
  
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`; 
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`; 
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`; 
  
    return num.toFixed(2); 
  };

  return (
    <div className="account">
        <div className="account-container">
            <p className="credentials">Username: {user.username}</p>
            <p className="credentials">Email: {formatEmail(user.email)}</p>
            <p className="credentials">
              Profit: <span className={user.profit >= 0 ? 'positive-profit' : 'negative-profit'}>
                {formatProfit(user.profit)}
              </span>
            </p>
            <div className="row">
              <p className="credentials"><button className="change-password" onClick={() => setAction("cpassword")}>Change Password</button></p>
              <p className="credentials"><button className="delete-account" onClick={() => setAction("daccount")}>Delete Account</button></p>
              {action && (
                <div className={`modal-container ${isAccountClosing ? 'closing' : ''}`} onClick={closeAccountModal}>
                  <div className={`modal-content ${isAccountClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <AccountModal action={action} setAction={setAction} />
                  </div>
                </div>
              )}
            </div>
        </div>
    </div>
  );
}

export default Account;
