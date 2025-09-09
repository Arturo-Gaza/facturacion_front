import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserContenidoProvider } from './hooks/UserConteProvider';
import { StepProvider } from './hooks/StepProvider';
import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  // <React.StrictMode>  este me quita el llamado os veces del use effect revisar si en producion pasa eso si lo activamos
  <BrowserRouter >
    <StepProvider>
      <UserContenidoProvider>
        <SnackbarProvider maxSnack={5}>
           <GoogleOAuthProvider clientId="1049009189572-8gd1eak8631mc8pohdug8e8nb85t4t63.apps.googleusercontent.com">
          <App />
          </GoogleOAuthProvider>
        </SnackbarProvider>
      </UserContenidoProvider>
    </StepProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


