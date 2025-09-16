import React from 'react';

export default function Input({ id, type = 'text', value, onChange, placeholder, required = false }) {
    return (
        <input
            id={id}
            type={type}
            className='form-control'
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
        />
    );
}