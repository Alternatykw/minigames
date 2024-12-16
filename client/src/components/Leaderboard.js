import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = ({ user, isLoggedIn }) => {
  const [topUsers, setTopUsers] = useState([]);
  const [bottomUsers, setBottomUsers] = useState([]);
  const PLACEHOLDER = { username: '-', profit: '-' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profits');

        const processUsers = (users) =>
          users.map((user) => ({
            ...user,
            profit:
              user.profit && typeof user.profit === 'object' && user.profit.$numberDecimal
                ? user.profit.$numberDecimal 
                : user.profit || '-', 
          }));

        const paddedTopUsers = [
          ...processUsers(response.data.topUsers),
          ...Array(10 - response.data.topUsers.length).fill(PLACEHOLDER),
        ].slice(0, 10);

        const paddedBottomUsers = [
          ...processUsers(response.data.bottomUsers),
          ...Array(10 - response.data.bottomUsers.length).fill(PLACEHOLDER),
        ].slice(0, 10);

        setTopUsers(paddedTopUsers);
        setBottomUsers(paddedBottomUsers);
      } catch (err) {
        console.error(err.message);

        setTopUsers(Array(10).fill(PLACEHOLDER));
        setBottomUsers(Array(10).fill(PLACEHOLDER));
      }
    };

    fetchData();
  }, []);

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
    <div className="leaderboard-content">
        <div className="leaderboard-top">
            <div id='2'></div>
            <div id='1'></div>
            <div id='3'></div>
        </div>
        <div className="leaderboard-bot">
            <div className='hof'>
                <h2>Hall of Fame</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Username</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map((user, index) => (
                            <tr key={index} className={index === 0 ? 'top1' : 'leaderboard-tr'}>
                                <td>{index+1}</td>
                                <td>{user.username}</td>
                                <td>{formatProfit(user.profit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='hos'>
                <h2>Hall of Shame</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Username</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bottomUsers.map((user, index) => (
                            <tr key={index} className={index === 0 ? 'top1' : 'leaderboard-tr'}>
                                <td>{index+1}</td>
                                <td>{user.username}</td>
                                <td>{formatProfit(user.profit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

}

export default Leaderboard;
