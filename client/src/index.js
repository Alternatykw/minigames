import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './sites/LandingPage';
import Bombs from './sites/Bombs';
import Towers from './sites/Towers';
import NotFound from './sites/NotFound';
import Dice from './sites/Dice';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bombs" element={<Bombs />} />
        <Route path="/towers" element={<Towers />} />
        <Route path="/dice" element={<Dice />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
