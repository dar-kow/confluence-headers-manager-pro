import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Wanna measure perf? Pass a func to log results (like: reportWebVitals(console.log))
// or send to ur analytics thing. Check docs @ https://bit.ly/CRA-vitals
// TODO: Maybe setup proper analytics later?? This works 4 now...
reportWebVitals();
