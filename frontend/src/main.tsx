import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Auth0Provider
      domain="dev-zuoankzq3o30phbm.us.auth0.com"
      clientId="9z9kcbUMyB9SF1RYLH1yG0VJjkzjNIvq"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>,
  </StrictMode>,
)


