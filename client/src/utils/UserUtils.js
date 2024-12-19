import { useEffect, useState } from 'react';
import axios from 'axios';

export const useUserData = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    balance: 0,
    profit: 0,
    permissions: '',
    active: false,
    code: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      username: '',
      email: '',
      balance: 0,
      profit: 0,
      permissions: '',
      active: false,
      code: ''
    });
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
        const { username, email, balance, profit, permissions, active, code } = response.data;
        setUser({
          username,
          email,
          balance: parseFloat(balance.$numberDecimal), 
          profit: parseFloat(profit.$numberDecimal),   
          permissions,
          active,
          code
        });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        if (
          !error.response || 
          (error.response && error.response.status >= 401)
        ) {
          localStorage.removeItem('token');
          setUser({
            username: '',
            email: '',
            balance: 0,
            profit: 0,
            permissions: '',
            active: false,
            code: ''
          });
          setIsLoggedIn(false);
        }
      });
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn, setUser]);

  const modifyBalance = (updateBalanceValue, type) => {
    let updatedBalance = Math.round((parseFloat(user.balance) + parseFloat(updateBalanceValue)) * 100) / 100;
    let updatedProfit = Math.round((parseFloat(user.profit) + parseFloat(updateBalanceValue)) * 100) / 100;

    const payload = {
      balance: updatedBalance
    };
    if (type === 'game') {
      payload.profit = updatedProfit;
    }

    const token = localStorage.getItem('token');
    if (token) {
      axios.put('http://localhost:5000/user/modifybalance', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setUser((prevUser) => ({
          ...prevUser,
          balance: updatedBalance,
          ...(type === 'game' && { profit: updatedProfit }) 
        }));
      }).catch(error => {
        console.error('Error updating balance:', error);
      });
    }
  }

  return { handleLogout, isLoggedIn, setIsLoggedIn, user, modifyBalance, setUser };
};
