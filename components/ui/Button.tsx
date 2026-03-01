import React from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export function Button({
    className = '',
    variant = 'primary',
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseClass = `${styles.btn} ${styles[variant]} ${className}`;
    return (
        <button
            className={baseClass}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className={styles.spinner}>Loading...</span> : children}
        </button>
    );
}
