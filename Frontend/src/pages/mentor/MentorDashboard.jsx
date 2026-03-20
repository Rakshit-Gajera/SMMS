// ==============================================
// MENTOR DASHBOARD PAGE - FULLY FUNCTIONAL
// ==============================================
// Uses DataContext for sessions, fetches mentees directly from backend API

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { createSessionApi } from '../../services/api';

// ==============================================
// MENTOR DASHBOARD COMPONENT
// ==============================================
function MentorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        sessions,
        tasks,
        getSessionsByMentorId,
        getTasksByUserId,
        fetchSessionsForMentor,
    } = useData();

    const mentorId = user?.id || '';

    // Fetch real mentees from backend & sessions on mount
    const [myMentees, setMyMentees] = useState([]);
    const [menteesLoading, setMenteesLoading] = useState(true);

    useEffect(() => {
        if (!mentorId) {
            console.warn('[MentorDashboard] No mentorId yet, skipping fetch');
            return;
        }

        // Fetch sessions
        console.log(`[MentorDashboard] Fetching sessions for mentorId=${mentorId}`);
        fetchSessionsForMentor(mentorId);

        // Fetch mentees directly from backend (not from DataContext.users which is admin-only)
        console.log(`[MentorDashboard] Fetching mentees from /api/staff/${mentorId}/mentees`);
        setMenteesLoading(true);
        fetch(`/api/staff/${mentorId}/mentees`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('smms_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(r => {
            console.log(`[MentorDashboard] /api/staff/${mentorId}/mentees → HTTP ${r.status}`);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then(data => {
            console.log('[MentorDashboard] Raw mentees from API:', data);
            const mapped = (Array.isArray(data) ? data : []).map(s => ({
                id: s.EnrollmentNo,
                name: s.StudentName,
                email: s.EmailAddress || '',
                department: s.Description || 'Student',
                status: 'active',
                EnrollmentNo: s.EnrollmentNo,
                StudentID: s.StudentID,
            }));
            console.log(`[MentorDashboard] Mapped ${mapped.length} mentees:`, mapped);
            setMyMentees(mapped);
        })
        .catch(err => {
            console.error('[MentorDashboard] Failed to load mentees:', err);
            setMyMentees([]);
        })
        .finally(() => setMenteesLoading(false));
    }, [mentorId]);

    const mySessions = getSessionsByMentorId(mentorId);
    const myTasks = getTasksByUserId(mentorId);

    // All sessions sorted by date (most recent first for pending/past, soonest first for upcoming)
    const scheduledSessions = mySessions
        .filter(s => s.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const pendingSessions = mySessions
        .filter(s => s.status === 'pending')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentSessions = mySessions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    // For the stats card — count upcoming
    const upcomingSessions = scheduledSessions;

    // Pending tasks
    const pendingTasks = myTasks.filter(t => t.status === 'pending' || t.status === 'overdue');

    // At-risk students
    const atRiskCount = myMentees.filter(m => m.status === 'inactive').length;

    // Helper to get real visual status for scheduled sessions
    const getSessionDisplayStatus = (session) => {
        if (session.status !== 'scheduled') return session.status;
        const sessionDate = new Date(`${session.date}T${session.time || '00:00'}`);
        return sessionDate < new Date() ? 'pending' : 'upcoming';
    };

    // Hover states
    const [hoveredMentee, setHoveredMentee] = useState(null);
    const [hoveredSession, setHoveredSession] = useState(null);

    // ─── Full Session Modal State ───────────────────────────────────────────
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [sessionSubmitting, setSessionSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        DateOfMentoring: '',
        ScheduledMeetingDate: '',
        NextMentoringDate: '',
        MentoringMeetingAgenda: '',
        IssuesDiscussed: '',
        AttendanceStatus: '',
        AbsentRemarks: '',
        IsParentPresent: false,
        ParentName: '',
        ParentMobileNo: '',
        StudentsOpinion: '',
        ParentsOpinion: '',
        StaffOpinion: '',
        StressLevel: '',
        LearnerType: '',
        MentoringDocument: '',
        Description: '',
    });

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleOpenModal = () => {
        setFormData({
            studentId: '',
            DateOfMentoring: new Date().toISOString().split('T')[0],
            ScheduledMeetingDate: '',
            NextMentoringDate: '',
            MentoringMeetingAgenda: '',
            IssuesDiscussed: '',
            AttendanceStatus: '',
            AbsentRemarks: '',
            IsParentPresent: false,
            ParentName: '',
            ParentMobileNo: '',
            StudentsOpinion: '',
            ParentsOpinion: '',
            StaffOpinion: '',
            StressLevel: '',
            LearnerType: '',
            MentoringDocument: '',
            Description: '',
        });
        setIsSessionModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const student = myMentees.find(m => m.id === formData.studentId);
        const enrollmentNo = student?.EnrollmentNo || formData.studentId;

        console.log('[MentorDashboard] Submitting session for:', { mentorId, enrollmentNo, studentId: formData.studentId });
        console.log('[MentorDashboard] Student found:', student);

        const payload = {
            DateOfMentoring: formData.DateOfMentoring,
            ScheduledMeetingDate: formData.ScheduledMeetingDate || formData.DateOfMentoring,
            NextMentoringDate: formData.NextMentoringDate || null,
            MentoringMeetingAgenda: formData.MentoringMeetingAgenda,
            IssuesDiscussed: formData.IssuesDiscussed || null,
            AttendanceStatus: formData.AttendanceStatus || null,
            AbsentRemarks: formData.AbsentRemarks || null,
            IsParentPresent: formData.IsParentPresent ? 1 : 0,
            ParentName: formData.ParentName || null,
            ParentMobileNo: formData.ParentMobileNo || null,
            StudentsOpinion: formData.StudentsOpinion || null,
            ParentsOpinion: formData.ParentsOpinion || null,
            StaffOpinion: formData.StaffOpinion || null,
            StressLevel: formData.StressLevel || null,
            LearnerType: formData.LearnerType || null,
            MentoringDocument: formData.MentoringDocument || null,
            Description: formData.Description || null,
        };

        console.log('[MentorDashboard] Session payload:', payload);
        setSessionSubmitting(true);
        try {
            const result = await createSessionApi(mentorId, enrollmentNo, payload);
            console.log('[MentorDashboard] Session created:', result);
            // Refresh sessions after creating
            await fetchSessionsForMentor(mentorId);
            setIsSessionModalOpen(false);
        } catch (err) {
            console.error('[MentorDashboard] Session creation failed:', err);
            alert(`Failed to create session: ${err.message}`);
        } finally {
            setSessionSubmitting(false);
        }
    };

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
                        background: 'var(--gradient-cyan)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Mentor Dashboard
                </h1>
                <p className="text-secondary animate-fadeInUp delay-100">
                    Welcome, {user?.name?.split(' ')[0] || 'Mentor'}! Here's your mentoring overview.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <StatsCard
                    icon="groups"
                    gradient="purple"
                    label="My Mentees"
                    value={menteesLoading ? '...' : myMentees.length.toString()}
                    trend={menteesLoading ? 'Loading...' : `${myMentees.filter(m => m.status === 'active').length} active`}
                    trendType="positive"
                    delay={0}
                />
                <StatsCard
                    icon="event"
                    gradient="emerald"
                    label="Upcoming Sessions"
                    value={upcomingSessions.length.toString()}
                    trend={upcomingSessions.length > 0 ? `Next: ${getDateLabel(upcomingSessions[0]?.date)}` : 'None scheduled'}
                    delay={100}
                />
                <StatsCard
                    icon="warning"
                    gradient="orange"
                    label="Need Attention"
                    value={atRiskCount.toString()}
                    trend={atRiskCount > 0 ? 'Students at risk' : 'All on track'}
                    trendType={atRiskCount > 0 ? 'negative' : 'positive'}
                    delay={200}
                />
                <StatsCard
                    icon="task_alt"
                    gradient="pink"
                    label="Pending Tasks"
                    value={pendingTasks.length.toString()}
                    trend={`${myTasks.filter(t => t.status === 'overdue').length} overdue`}
                    delay={300}
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6">
                {/* My Mentees Card */}
                <div className="card animate-fadeInUp delay-400" style={{ padding: 'var(--space-6)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--accent-purple)' }}>groups</span>
                            My Mentees
                        </h3>
                        <button
                            onClick={() => navigate('/mentor/mentees')}
                            className="text-sm text-primary font-medium flex items-center gap-1"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {menteesLoading && (
                            <p className="text-secondary text-center p-4">Loading mentees...</p>
                        )}
                        {!menteesLoading && myMentees.slice(0, 4).map((mentee, index) => (
                            <div
                                key={mentee.id}
                                className="flex items-center gap-3 p-3 rounded-lg animate-fadeInUp"
                                style={{
                                    animationDelay: `${450 + index * 50}ms`,
                                    backgroundColor: hoveredMentee === mentee.id ? 'var(--bg-hover)' : 'var(--bg-main)',
                                    transition: 'all 0.25s ease',
                                    cursor: 'pointer',
                                    transform: hoveredMentee === mentee.id ? 'translateX(4px)' : 'translateX(0)',
                                }}
                                onClick={() => navigate('/mentor/mentees')}
                                onMouseEnter={() => setHoveredMentee(mentee.id)}
                                onMouseLeave={() => setHoveredMentee(null)}
                            >
                                <div
                                    className="avatar avatar-initials"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#d1fae5',
                                        color: '#059669',
                                        transition: 'transform 0.25s ease',
                                        transform: hoveredMentee === mentee.id ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    {mentee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p className="text-sm font-medium">{mentee.name}</p>
                                    <p className="text-xs text-secondary">{mentee.EnrollmentNo}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="status-dot active"></span>
                                    <span className="text-xs font-medium text-success">On Track</span>
                                </div>
                            </div>
                        ))}
                        {!menteesLoading && myMentees.length === 0 && (
                            <p className="text-secondary text-center p-4">No mentees assigned yet</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Sessions Card */}
                <div className="card animate-fadeInUp delay-500" style={{ padding: 'var(--space-6)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--accent-cyan)' }}>event</span>
                            Upcoming Sessions
                        </h3>
                        <button
                            onClick={() => navigate('/mentor/sessions')}
                            className="text-sm text-primary font-medium flex items-center gap-1"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {recentSessions.map((session, index) => (
                            <div
                                key={session.id}
                                className="p-4 rounded-lg border animate-fadeInUp"
                                style={{
                                    animationDelay: `${550 + index * 50}ms`,
                                    borderColor: session.status === 'scheduled' ? 'var(--primary)' : session.status === 'completed' ? 'var(--success)' : 'var(--warning)',
                                    borderWidth: index === 0 ? '2px' : '1px',
                                    transition: 'all 0.25s ease',
                                    transform: hoveredSession === session.id ? 'scale(1.02)' : 'scale(1)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate('/mentor/sessions')}
                                onMouseEnter={() => setHoveredSession(session.id)}
                                onMouseLeave={() => setHoveredSession(null)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`badge ${
                                        session.status === 'completed' ? 'badge-success' :
                                        session.status === 'pending'   ? 'badge-warning' :
                                        'badge-primary'
                                    }`}>
                                        {session.status === 'scheduled' ? getDateLabel(session.date) :
                                         session.status === 'pending'   ? 'Needs Action' :
                                         'Completed'}
                                    </span>
                                    <span className={`badge ${session.status === 'scheduled' ? 'badge-primary' : session.status === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ marginLeft: 'auto' }}>
                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold mb-1">{session.title}</p>
                                <p className="text-xs text-secondary">With {session.studentName} &bull; {session.date}</p>
                            </div>
                        ))}
                        {recentSessions.length === 0 && (
                            <p className="text-secondary text-center p-4">No sessions yet</p>
                        )}
                    </div>

                    <button
                        className="btn btn-primary w-full"
                        style={{ marginTop: 'var(--space-4)' }}
                        onClick={handleOpenModal}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Schedule New Session
                    </button>
                </div>
            </div>

            {/* ── Full Schedule Session Modal ── */}
            <Modal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                title="Schedule New Session"
                icon="event"
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    {/* ── Section: Basic Info ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>Basic Information</h4>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Select Mentee *</label>
                        <select name="studentId" className="input" value={formData.studentId} onChange={handleFormChange} required>
                            <option value="">Choose a mentee...</option>
                            {myMentees.map(m => <option key={m.id} value={m.id}>{m.name} ({m.EnrollmentNo})</option>)}
                        </select>
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Meeting Agenda / Title *</label>
                        <input type="text" name="MentoringMeetingAgenda" className="input" placeholder="e.g., Career Guidance, Academic Review" value={formData.MentoringMeetingAgenda} onChange={handleFormChange} required />
                    </div>

                    {/* ── Section: Dates ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', marginTop: 'var(--space-5)', color: 'var(--primary)' }}>Schedule</h4>

                    <div className="grid grid-cols-3 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Date of Mentoring *</label>
                            <input type="date" name="DateOfMentoring" className="input" value={formData.DateOfMentoring} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <label className="label">Scheduled Meeting Date</label>
                            <input type="date" name="ScheduledMeetingDate" className="input" value={formData.ScheduledMeetingDate} onChange={handleFormChange} />
                        </div>
                        <div>
                            <label className="label">Next Mentoring Date</label>
                            <input type="date" name="NextMentoringDate" className="input" value={formData.NextMentoringDate} onChange={handleFormChange} />
                        </div>
                    </div>

                    {/* ── Section: Session Details ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', marginTop: 'var(--space-5)', color: 'var(--primary)' }}>Session Details</h4>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Issues Discussed</label>
                        <textarea name="IssuesDiscussed" className="input" rows="3" placeholder="Summary of issues/topics discussed..." value={formData.IssuesDiscussed} onChange={handleFormChange} style={{ height: 'auto' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Attendance Status</label>
                            <select name="AttendanceStatus" className="input" value={formData.AttendanceStatus} onChange={handleFormChange}>
                                <option value="">-- Select --</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Absent Remarks</label>
                            <input type="text" name="AbsentRemarks" className="input" placeholder="Reason if absent..." value={formData.AbsentRemarks} onChange={handleFormChange} />
                        </div>
                    </div>

                    {/* ── Section: Parent Info ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', marginTop: 'var(--space-5)', color: 'var(--primary)' }}>Parent Information</h4>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" name="IsParentPresent" checked={formData.IsParentPresent} onChange={handleFormChange} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                            Parent was present during the session
                        </label>
                    </div>

                    {formData.IsParentPresent && (
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Parent Name</label>
                                <input type="text" name="ParentName" className="input" placeholder="Enter parent name" value={formData.ParentName} onChange={handleFormChange} />
                            </div>
                            <div>
                                <label className="label">Parent Mobile No</label>
                                <input type="text" name="ParentMobileNo" className="input" placeholder="Enter mobile number" value={formData.ParentMobileNo} onChange={handleFormChange} />
                            </div>
                        </div>
                    )}

                    {/* ── Section: Opinions & Feedback ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', marginTop: 'var(--space-5)', color: 'var(--primary)' }}>Opinions & Feedback</h4>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Student's Opinion</label>
                        <textarea name="StudentsOpinion" className="input" rows="2" placeholder="Feedback from the student..." value={formData.StudentsOpinion} onChange={handleFormChange} style={{ height: 'auto' }} />
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Parent's Opinion</label>
                        <textarea name="ParentsOpinion" className="input" rows="2" placeholder="Feedback from the parent (if present)..." value={formData.ParentsOpinion} onChange={handleFormChange} style={{ height: 'auto' }} />
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Staff / Mentor Opinion</label>
                        <textarea name="StaffOpinion" className="input" rows="2" placeholder="Your feedback as the mentor..." value={formData.StaffOpinion} onChange={handleFormChange} style={{ height: 'auto' }} />
                    </div>

                    {/* ── Section: Assessment ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', marginTop: 'var(--space-5)', color: 'var(--primary)' }}>Assessment</h4>

                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Stress Level</label>
                            <select name="StressLevel" className="input" value={formData.StressLevel} onChange={handleFormChange}>
                                <option value="">-- Select --</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Learner Type</label>
                            <select name="LearnerType" className="input" value={formData.LearnerType} onChange={handleFormChange}>
                                <option value="">-- Select --</option>
                                <option value="Fast">Fast</option>
                                <option value="Average">Average</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Section: Document & Notes ── */}
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', marginTop: 'var(--space-5)', color: 'var(--primary)' }}>Document & Notes</h4>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Mentoring Document (file path or link)</label>
                        <input type="text" name="MentoringDocument" className="input" placeholder="e.g., /reports/session_01.pdf or a URL" value={formData.MentoringDocument} onChange={handleFormChange} />
                    </div>
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label className="label">Additional Notes / Description</label>
                        <textarea name="Description" className="input" rows="2" placeholder="Any additional notes about the session..." value={formData.Description} onChange={handleFormChange} style={{ height: 'auto' }} />
                    </div>

                    {/* ── Buttons ── */}
                    <div className="flex gap-3 justify-end">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsSessionModalOpen(false)} disabled={sessionSubmitting}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={sessionSubmitting}>
                            {sessionSubmitting ? 'Scheduling...' : 'Schedule Session'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default MentorDashboard;
