// ==============================================
// MENTOR INFO PAGE - FULLY FUNCTIONAL
// ==============================================
// Student can view their assigned mentor's info

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

function MentorInfo() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getSessionsByStudentId, fetchSessionsForStudent } = useData();

    const enrollmentNo = user?.enrollmentNo || user?.id || '';
    const studentId = user?.id || '';

    // Fetch mentor from backend directly (students can't read all users)
    const [mentor, setMentor] = useState(null);
    const [mentorLoading, setMentorLoading] = useState(true);

    useEffect(() => {
        if (!enrollmentNo) { setMentorLoading(false); return; }

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
                    menteeCount: data.menteeCount || 0,
                    status: 'active',
                    id: data.StaffID,
                });
            }
            setMentorLoading(false);
        })
        .catch(() => setMentorLoading(false));
    }, [enrollmentNo]);

    const sessions = getSessionsByStudentId(studentId);
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const upcomingSessions = sessions.filter(s => s.status === 'scheduled');

    if (mentorLoading) {
        return (
            <div className="animate-fadeIn">
                <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p className="text-secondary">Loading mentor info...</p>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="animate-fadeIn">
                <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--text-muted)' }}>
                        person_off
                    </span>
                    <h2 className="font-semibold mt-4">No Mentor Assigned</h2>
                    <p className="text-secondary mt-2">Please contact the administration to get assigned a mentor.</p>
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/student/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                    My Mentor
                </h1>
                <p className="text-secondary">View your assigned mentor's profile and contact information.</p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-6">
                {/* Mentor Profile Card */}
                <div className="card" style={{ padding: 'var(--space-6)', gridColumn: 'span 2' }}>
                    <div className="flex gap-6">
                        {/* Avatar */}
                        <div
                            className="avatar avatar-initials"
                            style={{
                                width: '120px',
                                height: '120px',
                                fontSize: '2.5rem',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                flexShrink: 0,
                            }}
                        >
                            {mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <h2
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {mentor.name}
                            </h2>
                            <p className="text-secondary mb-4">{mentor.department}</p>

                            {/* Contact Info */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">email</span>
                                    <a href={`mailto:${mentor.email}`} className="text-sm text-primary">
                                        {mentor.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">badge</span>
                                    <span className="text-sm">Faculty Mentor</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">groups</span>
                                    <span className="text-sm">{mentor.menteeCount || 0} mentees assigned</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <a href={`mailto:${mentor.email}`} className="btn btn-primary" style={{ flex: 1 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                            Send Email
                        </a>
                        <button onClick={() => navigate('/student/sessions')} className="btn btn-secondary" style={{ flex: 1 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>event</span>
                            View Sessions
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-col gap-4">
                    {/* Sessions Completed */}
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--gradient-emerald)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ color: 'white' }}>check_circle</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedSessions.length}</p>
                                <p className="text-sm text-secondary">Sessions Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--gradient-cyan)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ color: 'white' }}>event</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                                <p className="text-sm text-secondary">Upcoming Sessions</p>
                            </div>
                        </div>
                    </div>

                    {/* Mentor Status */}
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: mentor.status === 'active' ? '#d1fae5' : '#fef3c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ color: mentor.status === 'active' ? '#059669' : '#d97706' }}>
                                    {mentor.status === 'active' ? 'verified' : 'schedule'}
                                </span>
                            </div>
                            <div>
                                <p className="text-lg font-bold capitalize">{mentor.status}</p>
                                <p className="text-sm text-secondary">Mentor Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentorInfo;
