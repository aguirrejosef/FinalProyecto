// Users.jsx
import React, { useState, useEffect } from 'react';
import './CardsUsuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/usuarios'); // Ajusta tu endpoint
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener los datos: {error.message}</div>;

  return (
    <div className="users-list">
      {usuarios.map((user) => (
        <div key={user.id} className="user-card">
          <img 
            src={user.fotoGoogle || '/imagenes/default-user.png'} 
            alt="Foto del usuario" 
            className="user-card__foto" 
          />
          <div className="user-card__info">
            <h3>{user.correo}</h3>
            <p>Club: {user.clubTurno}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Usuarios;
