import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../pages/Login.css';
import Logo from '../Logo/Logo';

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecuperarPassword = () => window.location.href = '/recuperar-password';
  const handleRegistroClub = () => window.location.href = '/registro-club';

  const handleLoginManual = async () => {
    if (!correo || !password) {
      setErrorMessage('Por favor ingresa tu usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: correo, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || 'Error desconocido');
        return;
      }
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('usuario', data.usuario);
      if (data.rol === 'admin') window.location.href = '/admin';
      else if (data.rol === 'club') window.location.href = '/club';
      else window.location.href = '/';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Login social con Google
  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/usuarios/login-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Login Google:', data); // Para verificar rol y usuario
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('usuario', data.usuario);

        if (data.rol === 'admin') navigate('/admin');
        else if (data.rol === 'club') navigate('/canchas');
        else navigate('/');
      } else {
        setErrorMessage(data.message || 'Error login con Google');
      }
    } catch (error) {
      console.error('Error login Google:', error);
      setErrorMessage('Error al conectar con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="852264110344-fgjqpscj6v4s4eg6tvchaii2ctiapoh0.apps.googleusercontent.com">
      <div id='contenedor-login'>
        <div className='grid-login'>

          <div className="grid-item-login">
            <div className="contenedor-img-login" id='img-usuario'></div>
            <h2 className='titulo-login'>Quiero reservar un turno</h2>

            {/* Nuevo componente GoogleLogin */}
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setErrorMessage('Error en login de Google')}
            />
          </div>

          <div className='grid-item-login'>
            <div className="contenedor-img-login" id='img-negocio'></div>
            <h2 className='titulo-login'>Quiero gestionar mi club</h2>

            <div className="formulario-negocio">
              <input
                type='text'
                placeholder='Usuario o Correo'
                className='input-usuario'
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <input
                type='password'
                placeholder='Contraseña'
                className='input-contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className='btn-iniciar-sesion' onClick={handleLoginManual} disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p className='recuperar-password-negocio' onClick={handleRecuperarPassword}>
              ¿Has olvidado tu contraseña?
            </p>
            <p className='registro-negocio' onClick={handleRegistroClub}>
              ¿Eres nuevo? Regístrate aquí
            </p>
          </div>

        </div>

        <div className="contenedor-logo">
          <Logo />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
