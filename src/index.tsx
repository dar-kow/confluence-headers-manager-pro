import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './App.css';

// Set up fast rendering to make the popup responsive
document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});