import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');

if (redirect) {
  // Reemplaza la URL actual por la ruta correcta sin recargar la página
  window.history.replaceState(null, '', redirect);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

