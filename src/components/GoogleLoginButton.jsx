// components/GoogleLoginButton.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import requests from '../components/AxiosCalls/AxiosCallsLocal';

const GoogleLoginButton = () => {
const handleSuccess = async (credentialResponse) => {
  try {
    // token de Google
    const tokenGoogle = credentialResponse.credential;

    // mandar token al backend
    const response = await requests.post('/auth/google/token', {
      token: tokenGoogle
    });

    // guardar sesión
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Error en autenticación:', error);
  }
};


  const handleError = () => {
    console.log('Error en inicio de sesión con Google');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        flow="redirect"
      />
    </div>
  );
};

export default GoogleLoginButton;