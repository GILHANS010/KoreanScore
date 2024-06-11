import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import JeongganboEditor from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <JeongganboEditor />
  </React.StrictMode>
);

reportWebVitals();