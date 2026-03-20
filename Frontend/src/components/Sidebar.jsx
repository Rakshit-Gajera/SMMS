// ==============================================
// SIDEBAR COMPONENT - ENHANCED WITH ANIMATIONS
// ==============================================
// Navigation menu with:
// - Icon hover bounce effects
// - Active indicator slide animation
// - Avatar glow on hover
// - Logo pulse animation
// - Smooth transitions throughout

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// ==============================================
// MENU CONFIGURATIONS FOR EACH ROLE
// ==============================================
const menuConfig = {
    admin: [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/admin/users', icon: 'group', label: 'User Management' },
        { path: '/admin/reports', icon: 'analytics', label: 'Reports' },
    ],
    mentor: [
        { path: '/mentor/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/mentor/mentees', icon: 'school', label: 'My Mentees' },
        { path: '/mentor/sessions', icon: 'event', label: 'Sessions' },
        { path: '/mentor/feedback', icon: 'rate_review', label: 'Feedback' },
    ],
    student: [
        { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/student/mentor', icon: 'person', label: 'My Mentor' },
        { path: '/student/sessions', icon: 'event', label: 'Sessions' },
        { path: '/student/reports', icon: 'assessment', label: 'My Reports' },
    ],
};

// Role labels with colors
const roleConfig = {
    admin: { label: 'Admin Console', color: 'var(--accent-purple)', gradient: 'var(--gradient-purple)' },
    mentor: { label: 'Mentor Portal', color: 'var(--accent-cyan)', gradient: 'var(--gradient-cyan)' },
    student: { label: 'Student Portal', color: 'var(--primary)', gradient: 'var(--gradient-primary)' },
};

// ==============================================
// SIDEBAR COMPONENT
// ==============================================
function Sidebar({ role }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);

    const menuItems = menuConfig[role] || [];
    const roleInfo = roleConfig[role] || { label: 'Portal', color: 'var(--primary)', gradient: 'var(--gradient-primary)' };

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
        <aside
            className="sidebar animate-slideInLeft"
            style={{
                width: '260px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-light)',
                height: '100vh',
                position: 'sticky',
                top: 0,
            }}
        >
            {/* ==============================================
          TOP SECTION - Logo and Portal Name
          ============================================== */}
            <div className="p-6">
                {/* Logo and title row */}
                <div
                    className="flex items-center gap-3 mb-8"
                    onMouseEnter={() => setIsLogoHovered(true)}
                    onMouseLeave={() => setIsLogoHovered(false)}
                    style={{ cursor: 'pointer' }}
                >
                    {/* Animated logo circle */}
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-lg)',
                            background: roleInfo.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            transform: isLogoHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
                            boxShadow: isLogoHovered ? '0 8px 25px rgba(102, 126, 234, 0.4)' : 'var(--shadow-sm)',
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: '24px',
                                transition: 'transform 0.3s ease',
                                transform: isLogoHovered ? 'scale(1.1)' : 'scale(1)',
                            }}
                        >
                            school
                        </span>
                    </div>

                    {/* Portal name and subtitle */}
                    <div>
                        <h1
                            style={{
                                fontSize: '1rem',
                                fontWeight: '700',
                                transition: 'color 0.3s ease',
                                color: isLogoHovered ? roleInfo.color : 'var(--text-primary)',
                            }}
                        >
                            {roleInfo.label}
                        </h1>
                        <p className="text-xs text-secondary">University Portal</p>
                    </div>
                </div>

                {/* ==============================================
            NAVIGATION MENU
            ============================================== */}
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const isHovered = hoveredItem === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="animate-fadeInUp"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    textDecoration: 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
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
                                    transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)',
                                }}
                                onMouseEnter={() => setHoveredItem(item.path)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '4px',
                                            height: '24px',
                                            background: roleInfo.gradient,
                                            borderRadius: '0 4px 4px 0',
                                            animation: 'scaleIn 0.3s ease',
                                        }}
                                    />
                                )}

                                {/* Icon with hover animation */}
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontSize: '22px',
                                        transition: 'all 0.25s ease',
                                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                                    }}
                                >
                                    {item.icon}
                                </span>

                                {/* Menu label */}
                                <span>{item.label}</span>

                                {/* Hover arrow indicator */}
                                {isHovered && !isActive && (
                                    <span
                                        className="material-symbols-outlined animate-fadeIn"
                                        style={{
                                            marginLeft: 'auto',
                                            fontSize: '18px',
                                            opacity: 0.5,
                                        }}
                                    >
                                        chevron_right
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* ==============================================
          BOTTOM SECTION - User Profile and Logout
          ============================================== */}
            <div
                style={{
                    marginTop: 'auto',
                    padding: 'var(--space-6)',
                    borderTop: '1px solid var(--border-light)',
                }}
            >
                <div
                    className="flex items-center gap-3"
                    style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all 0.25s ease',
                        backgroundColor: isProfileHovered ? 'var(--bg-hover)' : 'transparent',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={() => setIsProfileHovered(true)}
                    onMouseLeave={() => setIsProfileHovered(false)}
                >
                    {/* User Avatar with glow effect */}
                    <div
                        className="avatar avatar-initials"
                        style={{
                            width: '42px',
                            height: '42px',
                            transition: 'all 0.3s ease',
                            boxShadow: isProfileHovered ? '0 0 15px rgba(43, 108, 238, 0.4)' : 'none',
                            transform: isProfileHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        {getInitials(user?.name)}
                    </div>

                    {/* User name and role */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p
                            className="text-sm font-semibold truncate"
                            style={{
                                transition: 'color 0.2s ease',
                                color: isProfileHovered ? 'var(--primary)' : 'var(--text-primary)',
                            }}
                        >
                            {user?.name || 'User'}
                        </p>
                        <p
                            className="text-xs text-secondary truncate"
                            style={{ textTransform: 'capitalize' }}
                        >
                            {user?.role || 'Guest'}
                        </p>
                    </div>

                    {/* Logout button with hover effect */}
                    <button
                        className="btn-icon"
                        onClick={logout}
                        title="Log out"
                        style={{
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.25s ease',
                            backgroundColor: isProfileHovered ? 'var(--bg-main)' : 'transparent',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                            e.currentTarget.style.color = 'var(--danger)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = isProfileHovered ? 'var(--bg-main)' : 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
