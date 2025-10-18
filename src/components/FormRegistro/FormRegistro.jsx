import React, { useState, useEffect } from 'react';
import './FormRegistro.css';
import Modal from '../Modal/Modal';

function FormRegistro() {
  const [nombreClub, setNombreClub] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [nroTitular, setNroTitular] = useState('');
  const [edad, setEdad] = useState('');
  const [nroClub, setNroClub] = useState('');
  const [localidad, setLocalidad] = useState('San Miguel de Tucumán');
  const [direccion, setDireccion] = useState('');
  const [canchas, setCanchas] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const isFormValid =
      nombreClub &&
      nombreTitular &&
      nroTitular &&
      edad &&
      nroClub &&
      localidad &&
      direccion &&
      correo &&
      canchas &&
      usuario &&
      password;
    setIsSubmitDisabled(!isFormValid);
  }, [nombreClub, nombreTitular, nroTitular, edad, nroClub, localidad, direccion, correo, canchas, usuario, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clubData = {
      nombreClub,
      nombreTitular,
      nroTitular,
      edad,
      nroClub,
      localidad,
      direccion,
      correo,
      usuario,
      password,
      canchas
    };

    try {
      const response = await fetch('http://localhost:3000/usuarios/registro-club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clubData)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.message || 'Registro exitoso');

        // Limpiar campos
        setNombreClub('');
        setNombreTitular('');
        setNroTitular('');
        setEdad('');
        setNroClub('');
        setDireccion('');
        setCanchas('');
        setCorreo('');
        setUsuario('');
        setPassword('');
        setLocalidad('San Miguel de Tucumán');
      } else {
        setMensaje(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMensaje('No se pudo conectar con el servidor. Intenta nuevamente.');
    }

    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000);
  };

  return (
    <div className="form-container">
      <h1>Registro de Club</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del club:</label>
          <input type="text" value={nombreClub} onChange={(e) => setNombreClub(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nombre y Apellido del titular:</label>
          <input type="text" value={nombreTitular} onChange={(e) => setNombreTitular(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nro de celular del titular:</label>
          <input type="text" value={nroTitular} onChange={(e) => setNroTitular(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Edad:</label>
          <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Número de contacto del club:</label>
          <input type="tel" value={nroClub} onChange={(e) => setNroClub(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Localidad:</label>
          <select value={localidad} onChange={(e) => setLocalidad(e.target.value)} required>
            <option value="San Miguel de Tucumán">San Miguel de Tucumán</option>
            <option value="Yerba Buena">Yerba Buena</option>
            <option value="Tafí Viejo">Tafí Viejo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Cantidad de canchas:</label>
          <input type="number" value={canchas} onChange={(e) => setCanchas(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nombre de usuario:</label>
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={isSubmitDisabled}>Registrar</button>
      </form>

      {modalVisible && <Modal mensaje={mensaje} />}
    </div>
  );
}

export default FormRegistro;
