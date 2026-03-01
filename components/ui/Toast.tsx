'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styles from './toast.module.css';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <div key={toast.id} className={`${styles.toast} ${styles[toast.variant]}`}>
                        <span>{toast.message}</span>
                        <button className={styles.closeButton} onClick={() => removeToast(toast.id)}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
