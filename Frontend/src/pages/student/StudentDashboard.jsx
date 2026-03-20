// ==============================================
// STUDENT DASHBOARD PAGE - FULLY FUNCTIONAL
// ==============================================
// Uses DataContext for real persistent data
// Shows mentor info, sessions, and tasks

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// ==============================================
// STUDENT DASHBOARD COMPONENT
// ==============================================
function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        getSessionsByStudentId,
        getTasksByUserId,
        toggleTaskComplete,
        fetchSessionsForStudent,
        fetchTasksForStudent,
    } = useData();

    // State
    const [hoveredTask, setHoveredTask] = useState(null);
    const [mentor, setMentor] = useState(null);

    const enrollmentNo = user?.enrollmentNo || user?.id || '';
    const studentId = enrollmentNo;

    // Fetch assigned mentor directly from backend (students can't read all users)
    useEffect(() => {
        if (!enrollmentNo) return;
        console.log(`[StudentDashboard] enrollmentNo=${enrollmentNo}`);

        // Fetch mentor info
        fetch(`/api/studentmentor/current/${enrollmentNo}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('smms_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            if (data && data.StaffName) {
                setMentor({
                    name: data.StaffName,
                    email: data.EmailAddress || '',
                    department: data.StaffDescription || 'Faculty',
                    id: data.StaffID,
                });
            }
        })
        .catch(() => {});

        // Also load student's sessions so dashboard stats are real
        console.log(`[StudentDashboard] Fetching sessions for enrollmentNo=${enrollmentNo}`);
        fetchSessionsForStudent(enrollmentNo);
        // And load student's tasks
        fetchTasksForStudent(enrollmentNo);
    }, [enrollmentNo]);

    // Get real data for this student
    const mySessions = getSessionsByStudentId(studentId);
    const myTasks = getTasksByUserId(studentId);

    // Upcoming session
    const upcomingSession = mySessions
        .filter(s => s.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    // Completed sessions count
    const completedSessions = mySessions.filter(s => s.status === 'completed').length;

    // Pending tasks
    const pendingTasks = myTasks.filter(t => t.status !== 'completed');

    // Get date label
    const getDateLabel = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get task priority color
    const getPriorityColor = (task) => {
        if (task.status === 'overdue') return 'var(--danger)';
        if (task.priority === 'high') return 'var(--warning)';
        return 'var(--text-secondary)';
    };

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
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
                    }}
                >
                    Student Dashboard
                </h1>
                <p className="text-secondary animate-fadeInUp delay-100">
                    Welcome, {user?.name?.split(' ')[0] || 'Student'}! Here's your mentoring summary.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <StatsCard
                    icon="person"
                    gradient="purple"
                    label="My Mentor"
                    value={mentor ? '1' : '0'}
                    trend={mentor?.name || 'Unassigned'}
                    delay={0}
                />
                <StatsCard
                    icon="history"
                    gradient="emerald"
                    label="Sessions Completed"
                    value={completedSessions.toString()}
                    trend="This semester"
                    trendType="positive"
                    delay={100}
                />
                <StatsCard
                    icon="assignment"
                    gradient="orange"
                    label="Pending Tasks"
                    value={pendingTasks.length.toString()}
                    trend={`${myTasks.filter(t => t.status === 'overdue').length} overdue`}
                    delay={200}
                />
                <StatsCard
                    icon="event"
                    gradient="pink"
                    label="Next Session"
                    value={upcomingSession ? '1' : '0'}
                    trend={upcomingSession ? getDateLabel(upcomingSession.date) : 'None scheduled'}
                    delay={300}
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6">
                {/* Mentor Info Card */}
                <div className="card animate-fadeInUp delay-400" style={{ padding: 'var(--space-6)' }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{ color: 'var(--accent-purple)' }}>person</span>
                        My Mentor
                    </h3>

                    {mentor ? (
                        <>
                            {/* Mentor Profile */}
                            <div
                                className="flex items-center gap-4 p-4 rounded-lg mb-4"
                                style={{ backgroundColor: 'var(--primary-light)' }}
                            >
                                <div
                                    className="avatar avatar-lg avatar-initials"
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        fontSize: '1.25rem',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                    }}
                                >
                                    {mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{mentor.name}</h4>
                                    <p className="text-secondary text-sm">{mentor.department}</p>
                                    <p className="text-secondary text-sm">{mentor.email}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/student/mentor')}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                                    View Profile
                                </button>
                                <button
                                    onClick={() => navigate('/student/sessions')}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>event</span>
                                    View Sessions
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-muted)' }}>
                                person_off
                            </span>
                            <p className="text-secondary mt-2">No mentor assigned yet</p>
                            <p className="text-xs text-muted">Please contact the admin</p>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                    {/* Upcoming Session Card */}
                    <div className="card animate-fadeInUp delay-500" style={{ padding: 'var(--space-6)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--accent-cyan)' }}>event</span>
                                Next Session
                            </h3>
                            <button
                                onClick={() => navigate('/student/sessions')}
                                className="text-sm text-primary font-medium flex items-center gap-1"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                All Sessions <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                            </button>
                        </div>

                        {upcomingSession ? (
                            <div
                                className="p-4 rounded-lg"
                                style={{
                                    backgroundColor: 'var(--primary-light)',
                                    border: '2px solid var(--primary)',
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="badge badge-primary">{getDateLabel(upcomingSession.date)}</span>
                                    <span className="text-sm font-medium">{upcomingSession.time}</span>
                                </div>
                                <p className="text-lg font-semibold mb-1">{upcomingSession.title}</p>
                                <p className="text-sm text-secondary mb-3">
                                    With {upcomingSession.mentorName}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-secondary">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                                    {upcomingSession.location}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-4">
                                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-muted)' }}>
                                    event_busy
                                </span>
                                <p className="text-secondary mt-2">No upcoming sessions</p>
                            </div>
                        )}
                    </div>

                    {/* Tasks Card */}
                    <div className="card animate-fadeInUp delay-600" style={{ padding: 'var(--space-6)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--accent-orange)' }}>task_alt</span>
                                My Tasks
                            </h3>
                            <span className={`badge ${pendingTasks.length > 0 ? 'badge-warning' : 'badge-success'}`}>
                                {pendingTasks.length} Pending
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {myTasks.slice(0, 4).map((task, index) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border animate-fadeInUp"
                                    style={{
                                        animationDelay: `${650 + index * 50}ms`,
                                        backgroundColor: hoveredTask === task.id ? 'var(--bg-hover)' : 'transparent',
                                        transition: 'all 0.25s ease',
                                        opacity: task.status === 'completed' ? 0.6 : 1,
                                    }}
                                    onMouseEnter={() => setHoveredTask(task.id)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'completed'}
                                        onChange={() => toggleTaskComplete(task.id)}
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            cursor: 'pointer',
                                            accentColor: 'var(--primary)',
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p
                                            className="text-sm font-medium"
                                            style={{
                                                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                            }}
                                        >
                                            {task.title}
                                        </p>
                                        <p className="text-xs" style={{ color: getPriorityColor(task) }}>
                                            {task.status === 'overdue' ? 'Overdue: ' : 'Due: '}
                                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    {task.status === 'completed' && (
                                        <span className="material-symbols-outlined text-success" style={{ fontSize: '20px' }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            ))}
                            {myTasks.length === 0 && (
                                <p className="text-secondary text-center p-4">No tasks assigned</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
