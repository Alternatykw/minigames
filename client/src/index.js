import Navbar from './components/Navbar';
import FlyoutMenu from './components/FlyoutMenu';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="landing-page">
      <Navbar />
      <FlyoutMenu />
      <div className="content">
        <h1>Welcome to our Dark Themed Landing Page</h1>
        <p>This is a sample landing page built with React, featuring a dark theme.</p>
      </div>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
