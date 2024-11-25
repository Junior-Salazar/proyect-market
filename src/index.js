import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CarritoProvider } from './context/CarritoContext';

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
    <CarritoProvider>
        <App />
    </CarritoProvider>
);
