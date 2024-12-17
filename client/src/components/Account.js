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
    }
    return email;  
  };

  return (
    <div className="account">
        <div className="account-container">
            <p className="credentials">Username: {user.username}</p>
            <p className="credentials">Email: {formatEmail(user.email)}</p>
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
