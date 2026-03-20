// ==============================================
// ADMIN DASHBOARD PAGE - FULLY FUNCTIONAL
// ==============================================
// Main dashboard for Admin users with:
// - Real data from DataContext
// - Staggered card entrance animations
// - Functional quick action buttons
// - Working notification system

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import Modal from '../../components/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

// ==============================================
// ADMIN DASHBOARD COMPONENT
// ==============================================
function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        users,
        sessions,
        tasks,
        notifications,
        getMentors,
        getStudents,
        addUser,
        markNotificationRead,
        clearAllNotifications,
    } = useData();

    // State for modals and interactions
    const [hoveredAction, setHoveredAction] = useState(null);
    const [hoveredUser, setHoveredUser] = useState(null);
    const [hoveredAlert, setHoveredAlert] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        status: 'active',
        MobileNo: '',
        enrollmentOrStaffId: '',
    });

    // Calculate real stats
    const mentors = getMentors();
    const students = getStudents();
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'overdue');
    const activeAlerts = notifications.filter(n => !n.read);

    // Quick action buttons configuration
    const quickActions = [
        { id: 'add', icon: 'person_add', label: 'Add New User', color: 'var(--primary)', gradient: 'var(--gradient-primary)', action: () => setIsAddUserModalOpen(true) },
        { id: 'users', icon: 'group', label: 'Manage Users', color: 'var(--accent-cyan)', gradient: 'var(--gradient-cyan)', action: () => navigate('/admin/users') },
        { id: 'report', icon: 'analytics', label: 'View Reports', color: 'var(--accent-purple)', gradient: 'var(--gradient-purple)', action: () => navigate('/admin/reports') },
        { id: 'clear', icon: 'notifications_off', label: 'Clear Alerts', color: 'var(--accent-orange)', gradient: 'var(--gradient-orange)', action: () => clearAllNotifications() },
    ];

    // Get recent users (last 4 added)
    const recentUsers = [...users]
        .sort((a, b) => parseInt(b.id) - parseInt(a.id))
        .slice(0, 4)
        .map(u => ({
            ...u,
            initials: u.name.split(' ').map(n => n[0]).join('').substring(0, 2),
            color: u.role === 'mentor' ? 'var(--primary)' : u.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-cyan)',
        }));

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prev => ({ ...prev, [name]: value }));
    };

    // Handle add user submit
    const handleAddUser = async (e) => {
        e.preventDefault();
        console.log('[AdminDashboard] handleAddUser:', newUserData);
        const payload = { ...newUserData };
        if (newUserData.role === 'student') {
            payload.EnrollmentNo = newUserData.enrollmentOrStaffId;
            payload.id = newUserData.enrollmentOrStaffId;
        } else {
            payload.StaffID = newUserData.enrollmentOrStaffId;
            payload.id = newUserData.enrollmentOrStaffId;
        }
        try {
            await addUser(payload);
            setIsAddUserModalOpen(false);
            setNewUserData({ name: '', email: '', password: '', role: 'student', department: '', status: 'active', MobileNo: '', enrollmentOrStaffId: '' });
        } catch (err) {
            alert('Failed to add user: ' + err.message);
        }
    };

    // Handle alert click
    const handleAlertClick = (alertId) => {
        markNotificationRead(alertId);
    };

    return (
        <div className="animate-fadeIn">
            {/* ==============================================
          PAGE HEADER
          ============================================== */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1
                    className="animate-fadeInUp"
                    style={{
                        fontSize: '1.875rem',
                        fontWeight: '700',
                        marginBottom: 'var(--space-2)',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Admin Dashboard
                </h1>
                <p className="text-secondary animate-fadeInUp delay-100">
                    Welcome back, {user?.name?.split(' ')[0]}! Here's an overview of the mentoring system.
                </p>
            </div>

            {/* ==============================================
          STATS CARDS - Real data from context
          ============================================== */}
            <div
                className="grid grid-cols-4 gap-4"
                style={{ marginBottom: 'var(--space-8)' }}
            >
                <StatsCard
                    icon="school"
                    gradient="purple"
                    label="Total Mentors"
                    value={mentors.length.toString()}
                    trend={`${mentors.filter(m => m.status === 'active').length} active`}
                    trendType="positive"
                    delay={0}
                />
                <StatsCard
                    icon="groups"
                    gradient="pink"
                    label="Active Students"
                    value={students.length.toString()}
                    trend={`~${Math.round(students.length / Math.max(mentors.length, 1))} per mentor`}
                    delay={100}
                />
                <StatsCard
                    icon="pending_actions"
                    gradient="orange"
                    label="Pending Tasks"
                    value={pendingTasks.length.toString()}
                    trend={`${tasks.filter(t => t.status === 'overdue').length} overdue`}
                    trendType={tasks.filter(t => t.status === 'overdue').length > 0 ? 'negative' : 'neutral'}
                    delay={200}
                />
                <StatsCard
                    icon="notifications_active"
                    gradient="cyan"
                    label="Active Alerts"
                    value={activeAlerts.length.toString()}
                    trend={`${activeAlerts.filter(a => a.priority === 'high').length} high priority`}
                    delay={300}
                />
            </div>

            {/* ==============================================
          QUICK ACTIONS SECTION - All buttons work!
          ============================================== */}
            <div
                className="card animate-fadeInUp delay-400"
                style={{
                    padding: 'var(--space-6)',
                    marginBottom: 'var(--space-6)',
                }}
            >
                <h2
                    style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: 'var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
                        bolt
                    </span>
                    Quick Actions
                </h2>

                <div className="flex gap-3">
                    {quickActions.map((action, index) => (
                        <button
                            key={action.id}
                            className="btn animate-fadeInUp"
                            onClick={action.action}
                            style={{
                                animationDelay: `${450 + index * 50}ms`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: 'var(--space-3) var(--space-4)',
                                background: hoveredAction === action.id ? action.gradient : 'var(--bg-surface)',
                                color: hoveredAction === action.id ? 'white' : 'var(--text-primary)',
                                border: hoveredAction === action.id ? 'none' : '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-lg)',
                                transition: 'all 0.3s ease',
                                transform: hoveredAction === action.id ? 'translateY(-3px)' : 'translateY(0)',
                                boxShadow: hoveredAction === action.id
                                    ? '0 8px 25px rgba(102, 126, 234, 0.3)'
                                    : 'var(--shadow-sm)',
                            }}
                            onMouseEnter={() => setHoveredAction(action.id)}
                            onMouseLeave={() => setHoveredAction(null)}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '20px',
                                    transition: 'transform 0.3s ease, color 0.3s ease',
                                    transform: hoveredAction === action.id ? 'scale(1.2)' : 'scale(1)',
                                    color: hoveredAction === action.id ? 'white' : action.color,
                                }}
                            >
                                {action.icon}
                            </span>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ==============================================
          RECENT ACTIVITY SECTION
          ============================================== */}
            <div className="grid grid-cols-2 gap-6">
                {/* Recent Users Card */}
                <div
                    className="card animate-fadeInUp delay-500"
                    style={{ padding: 'var(--space-6)' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            className="font-semibold"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ color: 'var(--accent-purple)', fontSize: '20px' }}>
                                group
                            </span>
                            Recent Users
                        </h3>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="text-sm text-primary font-medium"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            View All
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                arrow_forward
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {recentUsers.map((userData, index) => (
                            <div
                                key={userData.id}
                                className="flex items-center gap-3 p-3 rounded-lg animate-fadeInUp"
                                style={{
                                    animationDelay: `${550 + index * 50}ms`,
                                    backgroundColor: hoveredUser === userData.id ? 'var(--bg-hover)' : 'transparent',
                                    transition: 'all 0.25s ease',
                                    cursor: 'pointer',
                                    transform: hoveredUser === userData.id ? 'translateX(4px)' : 'translateX(0)',
                                }}
                                onClick={() => navigate('/admin/users')}
                                onMouseEnter={() => setHoveredUser(userData.id)}
                                onMouseLeave={() => setHoveredUser(null)}
                            >
                                <div
                                    className="avatar avatar-initials"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        fontSize: '0.8rem',
                                        backgroundColor: `${userData.color}15`,
                                        color: userData.color,
                                        transition: 'all 0.25s ease',
                                        transform: hoveredUser === userData.id ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    {userData.initials}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p className="text-sm font-medium">{userData.name}</p>
                                    <p className="text-xs text-secondary">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} • {userData.department}</p>
                                </div>
                                <span
                                    className={`badge ${userData.status === 'active' ? 'badge-success' : 'badge-warning'}`}
                                    style={{
                                        transition: 'all 0.25s ease',
                                        transform: hoveredUser === userData.id ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                >
                                    {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Alerts Card */}
                <div
                    className="card animate-fadeInUp delay-600"
                    style={{ padding: 'var(--space-6)' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            className="font-semibold"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                            }}
                        >
                            <span
                                className="material-symbols-outlined animate-pulse"
                                style={{ color: 'var(--danger)', fontSize: '20px' }}
                            >
                                notifications_active
                            </span>
                            System Alerts ({activeAlerts.length})
                        </h3>
                        <button
                            onClick={clearAllNotifications}
                            className="text-sm text-primary font-medium"
                            style={{
                                transition: 'all 0.2s ease',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {activeAlerts.length === 0 ? (
                            <div className="text-center p-6 text-secondary">
                                <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.5 }}>
                                    check_circle
                                </span>
                                <p className="mt-2">No active alerts! 🎉</p>
                            </div>
                        ) : (
                            activeAlerts.slice(0, 4).map((alert, index) => {
                                const alertConfig = {
                                    warning: { icon: 'warning', bg: '#fee2e2', color: 'var(--danger)' },
                                    info: { icon: 'schedule', bg: '#fef3c7', color: 'var(--warning)' },
                                    reminder: { icon: 'info', bg: 'var(--primary-light)', color: 'var(--primary)' },
                                };
                                const config = alertConfig[alert.type] || alertConfig.info;

                                return (
                                    <div
                                        key={alert.id}
                                        className="flex items-start gap-3 p-3 rounded-lg animate-fadeInUp"
                                        style={{
                                            animationDelay: `${650 + index * 50}ms`,
                                            backgroundColor: config.bg,
                                            transition: 'all 0.25s ease',
                                            cursor: 'pointer',
                                            transform: hoveredAlert === alert.id ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: hoveredAlert === alert.id ? 'var(--shadow-md)' : 'none',
                                        }}
                                        onClick={() => handleAlertClick(alert.id)}
                                        onMouseEnter={() => setHoveredAlert(alert.id)}
                                        onMouseLeave={() => setHoveredAlert(null)}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                color: config.color,
                                                transition: 'transform 0.25s ease',
                                                transform: hoveredAlert === alert.id ? 'scale(1.2)' : 'scale(1)',
                                            }}
                                        >
                                            {config.icon}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <p className="text-sm font-medium">{alert.message}</p>
                                            <p className="text-xs text-secondary">
                                                {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority
                                            </p>
                                        </div>
                                        {hoveredAlert === alert.id && (
                                            <span
                                                className="material-symbols-outlined animate-fadeIn"
                                                style={{ color: 'var(--text-muted)', fontSize: '18px' }}
                                            >
                                                close
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* ==============================================
          ADD USER MODAL
          ============================================== */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                title="Add New User"
                icon="person_add"
            >
                <form onSubmit={handleAddUser}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            placeholder="Enter full name"
                            value={newUserData.name}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="Enter email address"
                            value={newUserData.email}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Role</label>
                        <select
                            name="role"
                            className="input"
                            value={newUserData.role}
                            onChange={handleFormChange}
                        >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            placeholder="Enter password"
                            value={newUserData.password}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">
                            {newUserData.role === 'student' ? 'Enrollment No' : 'Staff ID'}
                        </label>
                        <input
                            type="text"
                            name="enrollmentOrStaffId"
                            className="input"
                            placeholder={newUserData.role === 'student' ? 'e.g. 22CS001' : 'e.g. STAFF002'}
                            value={newUserData.enrollmentOrStaffId}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Department</label>
                        <input
                            type="text"
                            name="department"
                            className="input"
                            placeholder="Enter department"
                            value={newUserData.department}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Mobile Number</label>
                        <input
                            type="tel"
                            name="MobileNo"
                            className="input"
                            placeholder="Enter mobile number"
                            value={newUserData.MobileNo}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div className="flex gap-3 justify-end" style={{ marginTop: 'var(--space-6)' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsAddUserModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add User
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default AdminDashboard;
