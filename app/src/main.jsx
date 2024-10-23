import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
/**
 * 
 * @author Patrick Shaw
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/kv60032/app/">
    <App />
    </BrowserRouter>
  </React.StrictMode>,
)


