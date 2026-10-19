import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './DataContext';
import './styles/base.css';
import './styles/cards.css';
import './styles/catalog.css';
import './styles/pages.css';
import './styles/collections.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <DataProvider>
    <App />
  </DataProvider>
);
