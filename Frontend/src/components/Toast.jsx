// ==============================================
// TOAST NOTIFICATION COMPONENT
// ==============================================
// Animated toast notifications with:
// - Slide-in animation
// - Auto-dismiss with progress bar
// - Multiple toast types (success, error, warning, info)
// - Swipe to dismiss

import { useState, useEffect, createContext, useContext } from 'react';

// ==============================================
// TOAST CONTEXT
// ==============================================
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
    success: {
        icon: 'check_circle',
        color: 'var(--success)',
        bg: '#d1fae5',
    },
    error: {
        icon: 'error',
        color: 'var(--danger)',
        bg: '#fee2e2',
    },
    warning: {
        icon: 'warning',
        color: 'var(--warning)',
        bg: '#fef3c7',
    },
    info: {
        icon: 'info',
        color: 'var(--primary)',
        bg: 'var(--primary-light)',
    },
};

// ==============================================
// SINGLE TOAST COMPONENT
// ==============================================
function Toast({ id, type, message, duration, onRemove }) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const config = toastConfig[type] || toastConfig.info;

    useEffect(() => {
        // Progress bar animation
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                handleRemove();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration]);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(id), 300);
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                border: `1px solid ${config.bg}`,
                borderLeft: `4px solid ${config.color}`,
                minWidth: '320px',
                maxWidth: '400px',
                position: 'relative',
                overflow: 'hidden',
                animation: isExiting
                    ? 'slideOutRight 0.3s ease forwards'
                    : 'slideInRight 0.3s ease forwards',
                cursor: 'pointer',
            }}
            onClick={handleRemove}
        >
            {/* Icon */}
            <span
                className="material-symbols-outlined"
                style={{
                    color: config.color,
                    fontSize: '24px',
                    flexShrink: 0,
                }}
            >
                {config.icon}
            </span>

            {/* Message */}
            <div style={{ flex: 1 }}>
                <p
                    style={{
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-1)',
                    }}
                >
                    {message}
                </p>
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                    }}
                >
                    Click to dismiss
                </p>
            </div>

            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    close
                </span>
            </button>

            {/* Progress bar */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: `${progress}%`,
                    backgroundColor: config.color,
                    transition: 'width 50ms linear',
                }}
            />

            {/* Inline keyframes */}
            <style>
                {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
            </style>
        </div>
    );
}

// ==============================================
// TOAST CONTAINER COMPONENT
// ==============================================
function ToastContainer({ toasts, removeToast }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        >
            {toasts.map((toast) => (
                <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                    <Toast {...toast} onRemove={removeToast} />
                </div>
            ))}
        </div>
    );
}

// ==============================================
// TOAST PROVIDER
// ==============================================
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message, duration = 4000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const toast = {
        success: (message, duration) => addToast('success', message, duration),
        error: (message, duration) => addToast('error', message, duration),
        warning: (message, duration) => addToast('warning', message, duration),
        info: (message, duration) => addToast('info', message, duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// ==============================================
// USE TOAST HOOK
// ==============================================
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default Toast;
