import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { store } from './store/store.js'; // Import the store
import { Provider } from 'react-redux'; // Import the Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);