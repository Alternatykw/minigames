import React, { useState } from 'react';
import './Account.css';

const Account = ({ user }) => {
  const [email, setEmail] = useState(false);

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
            <p className="credentials"><button>Change Password</button></p>
            <p className="delete-account"><button>Delete Account</button></p>
        </div>
    </div>
  );
}

export default Account;
