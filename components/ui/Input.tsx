import React from 'react';
import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({
    className = '',
    label,
    error,
    ...props
}: InputProps) {
    const inputClass = `${styles.input} ${error ? styles.error : ''} ${className}`;

    return (
        <div className="mb-4">
            {label && <label className={styles.label}>{label}</label>}
            <input className={inputClass} {...props} />
            {error && <span style={{ color: 'var(--admin-error)', fontSize: '12px' }}>{error}</span>}
        </div>
    );
}
