
import React, { useState } from 'react';
import { LoginPage } from './features/auth';
import { DashboardPage } from './features/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [token, setToken] = useState(null);

  const cerrarSesion = () => {
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <LoginPage setToken={setToken} />
      ) : (
        <DashboardPage token={token} cerrarSesion={cerrarSesion} />
      )}
    </div>
  );
}
