// ==============================================
// LOGIN PAGE - EXACT DESIGN FROM REFERENCE
// ==============================================
// Features:
// - Student: Pink/magenta with bokeh background
// - Mentor: Purple-pink with silk wave background
// - Admin: Orange/amber with geometric dark background
// - 3D card rotation on role change

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { loginUser } from '../services/api';

// ==============================================
// THEME CONFIGURATIONS
// ==============================================
const roleThemes = {
    student: {
        id: 'student',
        label: 'Student',
        icon: 'person',
        // Pink/Magenta theme
        headerGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        buttonGradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
        accentColor: '#EC4899',
        // Dark purple with pink bokeh
        background: `
            radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.4) 0%, transparent 30%),
            radial-gradient(circle at 20% 80%, rgba(244, 114, 182, 0.3) 0%, transparent 25%),
            radial-gradient(circle at 60% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 20%),
            radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.25) 0%, transparent 20%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)
        `,
    },
    mentor: {
        id: 'mentor',
        label: 'Mentor',
        icon: 'school',
        // Purple-Pink gradient
        headerGradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
        buttonGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
        accentColor: '#A855F7',
        // Soft purple/pink silk waves
        background: `
            radial-gradient(ellipse at 100% 0%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
            linear-gradient(180deg, 
                #c4b5fd 0%, 
                #ddd6fe 15%,
                #e9d5ff 30%,
                #d8b4fe 50%,
                #c084fc 70%,
                #a78bfa 85%,
                #8b5cf6 100%
            )
        `,
    },
    admin: {
        id: 'admin',
        label: 'Admin',
        icon: 'shield_person',
        // Orange/Amber gradient
        headerGradient: 'linear-gradient(135deg, #F97316 0%, #D97706 100%)',
        buttonGradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        accentColor: '#F97316',
        // Dark brown/bronze with geometric shapes
        background: `
            linear-gradient(45deg, transparent 45%, rgba(249, 115, 22, 0.1) 45%, rgba(249, 115, 22, 0.1) 55%, transparent 55%),
            linear-gradient(-45deg, transparent 45%, rgba(249, 115, 22, 0.08) 45%, rgba(249, 115, 22, 0.08) 55%, transparent 55%),
            linear-gradient(135deg, #1c1917 0%, #292524 20%, #44403c 40%, #57534e 60%, #78716c 80%, #44403c 100%)
        `,
    },
};

// ==============================================
// LOGIN COMPONENT
// ==============================================
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { reloadUsers } = useData();

    // Role positions for rotation
    const rolePositions = { student: 0, mentor: 1, admin: 2 };

    // Form state
    const [selectedRole, setSelectedRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Animation state
    const [rotation, setRotation] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Get current theme
    const currentTheme = roleThemes[selectedRole];

    // Demo credentials (matching database seed data)
    const demoCredentials = {
        admin:   { email: 'admin@darshan.ac.in',   password: 'admin123',   name: 'Admin' },
        mentor:  { email: 'mentor@darshan.ac.in',  password: 'mentor123',  name: 'Mentor' },
        student: { email: 'student@darshan.ac.in', password: 'student123', name: 'Student' },
    };

    // Role list
    const roles = Object.values(roleThemes);

    // Handle role change with rotation
    const handleRoleChange = (newRole) => {
        if (newRole === selectedRole || isAnimating) return;

        const currentPos = rolePositions[selectedRole];
        const newPos = rolePositions[newRole];
        const positionDiff = newPos - currentPos;
        const rotationChange = positionDiff * -360;

        setSelectedRole(newRole);
        setEmail('');
        setPassword('');
        setError('');
        setIsAnimating(true);
        setRotation(prev => prev + rotationChange);

        setTimeout(() => setIsAnimating(false), Math.abs(positionDiff) * 300);
    };

    // Handle form submission – calls real backend API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAnimating) return;

        setError('');
        setIsLoading(true);
        console.log(`[Login] Attempting login — role: ${selectedRole}, email: ${email}`);

        try {
            const data = await loginUser(email, password, selectedRole);
            console.log('[Login] Login SUCCESS. User received:', data.user);
            login(data.user);
            // Reload all users from DB fresh so User Management is never stale
            await reloadUsers();
            navigate(`/${data.user.role}`);
        } catch (err) {
            console.error('[Login] Login FAILED:', err.message);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fill credentials
    const fillDemoCredentials = () => {
        if (isAnimating) return;
        const creds = demoCredentials[selectedRole];
        setEmail(creds.email);
        setPassword(creds.password);
        setError('');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: currentTheme.background,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                perspective: '1200px',
                transition: 'background 0.8s ease',
            }}
        >
            {/* Geometric decorations for Admin theme */}
            {selectedRole === 'admin' && (
                <>
                    <div style={{
                        position: 'absolute',
                        left: '-50px',
                        top: '20%',
                        width: '200px',
                        height: '200px',
                        border: '2px solid rgba(249, 115, 22, 0.3)',
                        transform: 'rotate(45deg)',
                        transition: 'opacity 0.6s ease',
                    }} />
                    <div style={{
                        position: 'absolute',
                        right: '-30px',
                        top: '40%',
                        width: '150px',
                        height: '150px',
                        border: '2px solid rgba(249, 115, 22, 0.25)',
                        transform: 'rotate(45deg)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        left: '10%',
                        bottom: '10%',
                        width: '100px',
                        height: '100px',
                        border: '2px solid rgba(249, 115, 22, 0.2)',
                        transform: 'rotate(45deg)',
                    }} />
                </>
            )}

            {/* 3D Card Container */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '380px',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transform: `rotateY(${rotation}deg)`,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Login Card */}
                <div
                    style={{
                        width: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '24px 24px 20px',
                            textAlign: 'center',
                            background: currentTheme.headerGradient,
                            transition: 'background 0.4s ease',
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '24px', color: 'white' }}
                            >
                                {currentTheme.icon}
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                color: 'white',
                                marginBottom: '6px',
                                fontStyle: 'italic',
                            }}
                        >
                            Student Mentoring System
                        </h1>

                        {/* Subtitle */}
                        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.8rem' }}>
                            Sign in as{' '}
                            <span
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    padding: '2px 10px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                }}
                            >
                                {currentTheme.label}
                            </span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ padding: '16px 24px 20px' }}>
                        {/* Role Selection */}
                        <div style={{ marginBottom: '16px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                }}
                            >
                                Select Your Role
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {roles.map((role) => {
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleRoleChange(role.id)}
                                            disabled={isAnimating}
                                            style={{
                                                flex: 1,
                                                padding: '12px 8px',
                                                borderRadius: '12px',
                                                border: isSelected ? 'none' : '1px solid #e5e7eb',
                                                background: isSelected ? role.buttonGradient : 'transparent',
                                                cursor: isAnimating ? 'wait' : 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    color: isSelected ? 'white' : '#9ca3af',
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {role.icon}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: isSelected ? 'white' : '#6b7280',
                                                }}
                                            >
                                                {role.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '6px',
                                }}
                            >
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9ca3af',
                                        fontSize: '20px',
                                    }}
                                >
                                    mail
                                </span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isAnimating}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 42px',
                                        fontSize: '0.9rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease',
                                        backgroundColor: '#f9fafb',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '14px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '6px',
                                }}
                            >
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9ca3af',
                                        fontSize: '20px',
                                    }}
                                >
                                    lock
                                </span>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isAnimating}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 42px',
                                        fontSize: '0.9rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease',
                                        backgroundColor: '#f9fafb',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    padding: '12px',
                                    backgroundColor: '#fef2f2',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    fontSize: '0.85rem',
                                    marginBottom: '16px',
                                    textAlign: 'center',
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isAnimating}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: 'white',
                                background: currentTheme.buttonGradient,
                                border: 'none',
                                borderRadius: '10px',
                                cursor: isLoading || isAnimating ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                opacity: isLoading ? 0.8 : 1,
                            }}
                        >
                            {isLoading ? (
                                'Signing in...'
                            ) : (
                                <>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        arrow_forward
                                    </span>
                                    Sign In as {currentTheme.label}
                                </>
                            )}
                        </button>

                        {/* Demo Credentials */}
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '14px',
                                backgroundColor: '#fafafa',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    color: '#9ca3af',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                }}
                            >
                                Demo Credentials for{' '}
                                <span style={{ color: currentTheme.accentColor }}>
                                    {currentTheme.label.toUpperCase()}
                                </span>
                            </p>
                            <div
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    color: '#4b5563',
                                    marginBottom: '10px',
                                }}
                            >
                                <p style={{ marginBottom: '4px' }}>
                                    <span style={{ color: '#9ca3af' }}>email:</span>{' '}
                                    {demoCredentials[selectedRole].email}
                                </p>
                                <p>
                                    <span style={{ color: '#9ca3af' }}>pass:</span>{' '}
                                    {demoCredentials[selectedRole].password}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fillDemoCredentials}
                                disabled={isAnimating}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: 'white',
                                    background: currentTheme.buttonGradient,
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: isAnimating ? 'wait' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                    auto_fix_high
                                </span>
                                Auto-fill Credentials
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <p
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    color: selectedRole === 'admin' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                    transition: 'color 0.4s ease',
                }}
            >
                © 2024 Student Mentoring System. All rights reserved.
            </p>
        </div>
    );
}

export default Login;
