// ==============================================
// MODAL COMPONENT - FIXED HOOK ORDER
// ==============================================
// Beautiful popup dialog with:
// - Backdrop blur effect
// - Slide-up entrance animation
// - Smooth close transition

import { useState, useEffect } from 'react';

// ==============================================
// MODAL COMPONENT
// ==============================================
function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    hasError = false,
    icon = null
}) {
    // ALL HOOKS MUST BE AT THE TOP - before any conditional returns!
    const [isClosing, setIsClosing] = useState(false);
    const [isCloseHovered, setIsCloseHovered] = useState(false);

    // Reset closing state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Handle smooth close with animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    // Handle overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Determine modal width based on size
    const getWidth = () => {
        switch (size) {
            case 'sm': return '400px';
            case 'lg': return '700px';
            case 'xl': return '900px';
            default: return '520px';
        }
    };

    // Don't render anything if modal is closed - AFTER all hooks!
    if (!isOpen) return null;

    return (
        // Dark overlay with backdrop blur
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                animation: isClosing ? 'fadeOut 0.2s ease forwards' : 'fadeIn 0.2s ease',
            }}
        >
            {/* Modal container */}
            <div
                className="modal"
                style={{
                    maxWidth: getWidth(),
                    borderRadius: 'var(--radius-2xl)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    animation: isClosing
                        ? 'modalSlideOut 0.2s ease forwards'
                        : hasError
                            ? 'shake 0.5s ease'
                            : 'modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Modal Header */}
                <div
                    className="modal-header"
                    style={{
                        padding: 'var(--space-5) var(--space-6)',
                        borderBottom: '1px solid var(--border-light)',
                        background: 'linear-gradient(to right, var(--bg-surface), rgba(248, 250, 252, 0.8))',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                            }}
                        >
                            {icon && (
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        color: 'var(--primary)',
                                        fontSize: '24px',
                                    }}
                                >
                                    {icon}
                                </span>
                            )}
                            {title}
                        </h2>

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="btn-icon"
                            aria-label="Close modal"
                            style={{
                                padding: 'var(--space-2)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.25s ease',
                                backgroundColor: isCloseHovered ? '#fee2e2' : 'transparent',
                                color: isCloseHovered ? 'var(--danger)' : 'var(--text-secondary)',
                                transform: isCloseHovered ? 'rotate(90deg)' : 'rotate(0)',
                            }}
                            onMouseEnter={() => setIsCloseHovered(true)}
                            onMouseLeave={() => setIsCloseHovered(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div
                    className="modal-body"
                    style={{
                        padding: 'var(--space-6)',
                    }}
                >
                    {children}
                </div>
            </div>

            {/* CSS animations */}
            <style>
                {`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes modalSlideOut {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
            </style>
        </div>
    );
}

export default Modal;
