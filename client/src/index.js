import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './sites/LandingPage';
import Bombs from './sites/Bombs';
import Towers from './sites/Towers';
import NotFound from './sites/NotFound';
import Dice from './sites/Dice';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AccountPage from './sites/AccountPage';
import { useUserData } from './utils/UserUtils';
import Roulette from './sites/Roulette';
import LeaderboardPage from './sites/LeaderboardPage';
import ForgotPage from './sites/ForgotPage';
import Activate from './sites/Activate';
import PassReset from './sites/PassReset';

const root = createRoot(document.getElementById('root'));

const App = () => {
  const { isLoggedIn, user } = useUserData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {(user.active || !user.username) ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bombs" element={<Bombs />} />
          <Route path="/towers" element={<Towers />} />
          <Route path="/dice" element={<Dice />} />
          <Route path="/account" element={isLoggedIn ? <AccountPage /> : <LandingPage />} />
          <Route path="/roulette" element={<Roulette />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route path="/passreset" element={<PassReset />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<Activate />} />
        </Routes>
      )}
    </Router>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
