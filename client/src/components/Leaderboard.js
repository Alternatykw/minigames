import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import trophy1 from "../images/trophy1.svg";
import trophy2 from "../images/trophy2.svg";
import trophy3 from "../images/trophy3.svg";

const Leaderboard = ({ user, isLoggedIn }) => {
  const [topUsers, setTopUsers] = useState([]);
  const [bottomUsers, setBottomUsers] = useState([]);

  useEffect(() => {
    const PLACEHOLDER = { username: '-', profit: '-' };
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
            <div id='place2'>
              <img src={trophy2} alt="second place" />
              <h2>#2 {topUsers[1]?.username || 'Loading...'}</h2>
              <h3>Profit: {formatProfit(topUsers[1]?.profit) || 'Loading...'}</h3>
            </div>
            <div id='place1'>
              <img src={trophy1} alt="first place" />
              <h1>#1 {topUsers[0]?.username || 'Loading...'}</h1>
              <h2>Profit: {formatProfit(topUsers[0]?.profit) || 'Loading...'}</h2>
            </div>
            <div id='place3'>
              <img src={trophy3} alt="third place" />
              <h2>#3 {topUsers[2]?.username || 'Loading...'}</h2>
              <h3>Profit: {formatProfit(topUsers[2]?.profit)|| 'Loading...'}</h3>
            </div>
        </div>
        <div className="leaderboard-bot">
            <div className='hof'>
                <h1>Hall of Fame</h1>
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
                            <tr key={index} className={index%2 === 0 ? 'even' : 'odd'}>
                                <td>#{index+1}</td>
                                <td>{user.username}</td>
                                <td>{formatProfit(user.profit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='hos'>
                <h1>Hall of Shame</h1>
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
                            <tr key={index} className={index%2 === 0 ? 'even' : 'odd'}>
                                <td>#{index+1}</td>
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
