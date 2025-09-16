import React from 'react';

export default function Button({ children, type = 'button', onClick, className = 'btn btn-primary' }) {
    return (
        <button type={type} onClick={onClick} className={className}>
            {children}
        </button>
    );
}
    