// ==============================================
// STUDENT LAYOUT - TOP NAVBAR (NO SIDEBAR)
// ==============================================
// A dedicated layout for student routes that uses
// a horizontal top navbar instead of a sidebar.

import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// Student navigation items
const navItems = [
    { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/student/mentor', icon: 'person', label: 'Mentor' },
    { path: '/student/sessions', icon: 'event', label: 'Sessions' },
    { path: '/student/reports', icon: 'assessment', label: 'My Reports' },
];

// ==============================================
// STUDENT LAYOUT COMPONENT
// ==============================================
function StudentLayout() {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const [hoveredNav, setHoveredNav] = useState(null);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    // Auth & role checks
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (user.role !== 'student') {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            {/* ============================================
                TOP NAVBAR
            ============================================ */}
            <header
                className="animate-fadeIn"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 var(--space-8, 2rem)',
                    height: '88px',
                    backgroundColor: 'var(--bg-surface)',
                    borderBottom: '2px solid var(--border-light)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                {/* LEFT: Logo */}
                <div className="flex items-center" style={{ flexShrink: 0 }}>
                    {/* Logo */}
                    <Link
                        to="/student/dashboard"
                        className="flex items-center gap-3"
                        style={{ textDecoration: 'none' }}
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                transform: isLogoHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                                boxShadow: isLogoHovered ? '0 8px 25px rgba(102, 126, 234, 0.4)' : 'var(--shadow-sm)',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                                school
                            </span>
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    color: isLogoHovered ? 'var(--primary)' : 'var(--text-primary)',
                                    transition: 'color 0.3s ease',
                                    lineHeight: 1.2,
                                }}
                            >
                                Student Portal
                            </h1>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
                                University Portal
                            </p>
                        </div>
                    </Link>

                </div>

                {/* CENTER: Nav Buttons */}
                <nav className="flex items-center" style={{ gap: 'var(--space-6, 1.5rem)' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const isHovered = hoveredNav === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-2) var(--space-4, 1rem)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? '600' : '500',
                                    textDecoration: 'none',
                                    transition: 'all 0.25s ease',
                                    backgroundColor: isActive
                                        ? 'var(--primary-light)'
                                        : isHovered
                                            ? 'var(--bg-hover)'
                                            : 'transparent',
                                    color: isActive
                                        ? 'var(--primary)'
                                        : isHovered
                                            ? 'var(--text-primary)'
                                            : 'var(--text-secondary)',
                                }}
                                onMouseEnter={() => setHoveredNav(item.path)}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontSize: '20px',
                                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* RIGHT: User Profile + Logout */}
                <div
                    className="flex items-center gap-3"
                    style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-main)',
                    }}
                >
                    {/* Avatar */}
                    <div
                        className="avatar avatar-initials"
                        style={{
                            width: '38px',
                            height: '38px',
                            fontSize: '0.85rem',
                            flexShrink: 0,
                        }}
                    >
                        {getInitials(user?.name)}
                    </div>

                    {/* Name + Role */}
                    <div style={{ lineHeight: 1.3 }}>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {user?.name || 'User'}
                        </p>
                        <p
                            style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                textTransform: 'capitalize',
                            }}
                        >
                            {user?.role || 'Student'}
                        </p>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        title="Log out"
                        className="btn-icon"
                        style={{
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.25s ease',
                            color: isLogoutHovered ? 'var(--danger)' : 'var(--text-secondary)',
                            backgroundColor: isLogoutHovered ? '#fee2e2' : 'transparent',
                            transform: isLogoutHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setIsLogoutHovered(true)}
                        onMouseLeave={() => setIsLogoutHovered(false)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            logout
                        </span>
                    </button>
                </div>
            </header>

            {/* ============================================
                PAGE CONTENT (full width, no sidebar)
            ============================================ */}
            <div className="page-content" style={{ padding: 'var(--space-6)' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default StudentLayout;
