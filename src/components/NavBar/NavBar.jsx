import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../NavBar/NavBar.css';
import Logo from '../Logo/Logo';

function NavBar() {
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const storedRol = localStorage.getItem('rol'); // rol guardado al login
    setRol(storedRol);
  }, []);

  // Define botones según rol
  const botonesAdmin = [
    { label: 'Historia', path: '/historia' },
    { label: 'Clubes', path: '/canchas' },
    { label: 'Usuarios', path: '/usuario' },
    { label: 'Novedades', path: '/novedades' },
    { label: 'Planes', path: '/planes' },
  ];

  const botonesClub = [
    { label: 'Historia', path: '/historia' },
    { label: 'Canchas', path: '/canchas' },
    { label: 'Usuarios', path: '/usuario' },
    { label: 'Novedades', path: '/novedades' },
    { label: 'Planes', path: '/planes' },
  ];

  const botonesCliente = [
    { label: 'Historia', path: '/historia' },
    { label: 'Clubes', path: '/canchas' },
    { label: 'Novedades', path: '/novedades' },
    { label: 'Planes', path: '/planes' },
  ];

  let botonesVisibles = [];
  if (rol === 'admin') botonesVisibles = botonesAdmin;
  else if (rol === 'club') botonesVisibles = botonesClub;
  else if (rol === 'cliente') botonesVisibles = botonesCliente;

  const handleLogout = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className='contenedor'>
      <div className='contenedor-grid'>
        <div className="grid-item1">
          <div className="contenedor-img-nav">
            <Logo />
          </div>
        </div>

        <div className="grid-item2">
          <div className="nav-buttons">
            {botonesVisibles.map((btn, i) => (
              <button key={i} className='nav-btn' onClick={() => navigate(btn.path)}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-item4">
          {rol ? (
            <button className='btn-iniciarSesion' onClick={handleLogout}>
              Cerrar Sesión
            </button>
          ) : (
            <button className='btn-iniciarSesion' onClick={() => navigate("/login")}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
