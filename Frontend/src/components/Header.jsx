// ==============================================
// HEADER COMPONENT - WITH COMMAND PALETTE
// ==============================================
// Top bar with:
// - Command palette search (Ctrl+K / Cmd+K)
// - Animated notification bell
// - User greeting with time-based message
// - Hover effects on buttons

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CommandPalette from './CommandPalette';

// ==============================================
// HEADER COMPONENT
// ==============================================
function Header({ title }) {
  const { user } = useAuth();
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);

  // Global keyboard shortcut for command palette (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get first name
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <>
      <header
        className="animate-fadeIn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-6)',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="btn-icon"
            style={{ display: 'none' }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Page title */}
          {title && (
            <h2
              className="text-lg font-semibold animate-fadeInUp"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Search / Command Palette Button */}
          <button
            className="btn-icon"
            onClick={() => setIsCommandPaletteOpen(true)}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              backgroundColor: isSearchHovered ? 'var(--bg-hover)' : 'var(--bg-main)',
              transition: 'all 0.25s ease',
              minWidth: '180px',
              justifyContent: 'space-between',
            }}
            title="Search (Ctrl+K)"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '18px',
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                }}
              >
                search
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  fontWeight: '400',
                }}
              >
                Search...
              </span>
            </div>
            <kbd
              style={{
                padding: '2px 6px',
                fontSize: '0.7rem',
                fontFamily: 'inherit',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-light)',
              }}
            >
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications button with animation */}
          <button
            className="btn-icon"
            style={{
              position: 'relative',
              transition: 'all 0.25s ease',
              transform: isNotificationHovered ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => setIsNotificationHovered(true)}
            onMouseLeave={() => setIsNotificationHovered(false)}
          >
            <span
              className="material-symbols-outlined"
              style={{
                animation: isNotificationHovered ? 'shake 0.5s ease' : 'none',
              }}
            >
              notifications
            </span>
            {/* Notification dot */}
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--danger)',
                borderRadius: '50%',
                border: '2px solid var(--bg-surface)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </button>

          {/* User greeting */}
          <div
            className="animate-fadeIn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <span className="text-sm text-secondary">
              {getGreeting()},{' '}
              <strong
                style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {firstName}
              </strong>
              ! 👋
            </span>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}

export default Header;
