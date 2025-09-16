
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

export default function DashboardPage({ token, cerrarSesion }) {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtener = async () => {
      try {
        const resp = await api.get('/dashboard', { headers: { Authorization: `Bearer ${token}` }});
        setMensaje(resp.data.mensaje);
      } catch (e) {
        setMensaje('No autorizado o error al obtener dashboard');
      }
    };
    obtener();
  }, [token]);

  return (
    <div className="container py-5">
      <h2>Dashboard</h2>
      <p>{mensaje}</p>
      <button className="btn btn-secondary" onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}
