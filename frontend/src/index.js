import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
    <Auth0Provider
        domain="dev-zuoankzq3o30phbm.us.auth0.com"
        clientId="x6qKEu8KeIm101QMbp8Zr1IwTn9Ki9Xx"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
    >
        <App />
    </Auth0Provider>,
);