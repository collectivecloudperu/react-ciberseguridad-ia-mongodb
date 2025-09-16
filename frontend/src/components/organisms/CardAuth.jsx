import React from 'react';

export default function CardAuth({ children, ancho = 520 }) {
    return (
        <div className="card p-4" style={{ maxWidth: ancho }}>
            {children}
        </div>
    )
}