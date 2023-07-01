import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { ZoomContextProvider } from './context/zoomContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ZoomContextProvider>
      <App />
    </ZoomContextProvider>
  </React.StrictMode>
);
