import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './sites/LandingPage';
import Bombs from './sites/Bombs';
import Towers from './sites/Towers';
import NotFound from './sites/NotFound';
import './index.css';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bombs" element={<Bombs />} />
        <Route path="/towers" element={<Towers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
