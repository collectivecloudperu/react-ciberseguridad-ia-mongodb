import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

export default function FormularioLogin({
    nombreUsuario, setNombreUsuario,
    contraseña, setContraseña,
    manejarLogin
}) {
    return (
        <form onSubmit={manejarLogin}>
            <div className="mb-3">
                <label className="form-label" htmlFor="usuario">Usuario</label>
                <Input id="usuario" value={nombreUsuario} onChange={(e)=>setNombreUsuario(e.target.value)} placeholder="Ingresa tu usuario" required />
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="contrasena">Contraseña</label>
                <Input id="contrasena" type="password" value={contraseña} onChange={(e)=>setContraseña(e.target.value)} placeholder="Ingresa tu contraseña" required />
            </div>

            <div className="d-flex justify-content-between">
                <Button type="submit">Iniciar sesión</Button>
            </div>
        </form>
    );
}