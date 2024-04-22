import { useEffect, useState } from 'react';
import axios from 'axios';

export const useUserData = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setBalance(0);
    setIsLoggedIn(false);
    window.location.reload(false);
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
  }, [setIsLoggedIn, setUsername, setBalance]);

  const modifyBalance = (updateBalanceValue) => {
    let updatedBalance = Math.round((parseFloat(balance) + parseFloat(updateBalanceValue)) * 100) / 100;

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
      .then(() => {
        setBalance(updatedBalance);
      }).catch(error => {
        console.error('Error updating balance:', error);
      });
    }
  }

  return { handleLogout, isLoggedIn, username, balance, modifyBalance };
};
