import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import api from '../../../services/api';
import FormularioLogin from '../../../components/molecules/FormularioLogin';
import CardAuth from '../../../components/organisms/CardAuth';

export default function LoginPage({ setToken }) {
  const [usuario, setUsuario] = useState({ nombre: '', contraseña: '' });
  const [mensaje, setMensaje] = useState('');
  const [intentos, setIntentos] = useState(0);
  const [prediccion, setPrediccion] = useState(0);
  const [modeloListo, setModeloListo] = useState(false);
  const modeloRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const modelo = tf.sequential();
      modelo.add(tf.layers.dense({ inputShape: [1], units: 1, activation: 'sigmoid' }));
      modelo.compile({ optimizer: 'sgd', loss: 'binaryCrossentropy' });
      await modelo.fit(tf.tensor2d([0,1,2,3,4,5],[6,1]), tf.tensor2d([0,0,0,1,1,1],[6,1]), { epochs: 120, verbose: 0 });
      if (mounted) { modeloRef.current = modelo; setModeloListo(true); }
    })();
    return () => mounted = false;
  }, []);

  const predecir = cantidad => modeloRef.current ? Number(modeloRef.current.predict(tf.tensor2d([cantidad],[1,1])).dataSync()[0].toFixed(3)) : 0;

  const manejarLogin = async e => {
    e.preventDefault();
    setMensaje('Procesando...');
    const puntuacion = modeloListo ? predecir(intentos) : 0;

    try {
      const { data } = await api.post('/login', { nombreUsuario: usuario.nombre, contraseña: usuario.contraseña, puntuacion });
      if (data.ok && data.token) { setToken(data.token); setIntentos(0); setMensaje('Inicio de sesión correcto — bienvenido'); }
      else setMensaje('Respuesta inesperada del servidor');
    } catch (err) {
      const data = err.response?.data;
      if (data?.bloqueada) setMensaje('Tu IP fue bloqueada por demasiados intentos fallidos');
      else if (data?.restantes !== undefined) {
        const nuevo = intentos + 1;
        setIntentos(nuevo);
        const prob = modeloListo ? predecir(nuevo) : 0;
        setPrediccion(prob);
        setMensaje(`Credenciales inválidas. Intentos: ${nuevo}. Predicción IA: ${prob}`);
      } else setMensaje(data?.mensaje || 'Error en la autenticación');
    }
  };

  return (
    <div className="container py-5 col-md-12">
      <h2 className="mb-3">Ciberseguridad en Frontend (IA + React + Tensorflow)</h2>
      <CardAuth>
        <FormularioLogin
          nombreUsuario={usuario.nombre} setNombreUsuario={nombre => setUsuario({...usuario, nombre})}
          contraseña={usuario.contraseña} setContraseña={pass => setUsuario({...usuario, contraseña: pass})}
          manejarLogin={manejarLogin}
        />
        <div className="mt-3">
          <div><strong>Intentos locales:</strong> {intentos}</div>
          <div><strong>Modelo IA listo:</strong> {modeloListo ? 'Sí' : 'No'}</div>
          <div><strong>Predicción IA:</strong> {prediccion}</div>
        </div>
      </CardAuth>
      <div className="alert alert-info mt-3">{mensaje}</div>
    </div>
  );
}
