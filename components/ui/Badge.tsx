import React from 'react';
import styles from './badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({
    className = '',
    variant = 'default',
    children,
    ...props
}: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
}
