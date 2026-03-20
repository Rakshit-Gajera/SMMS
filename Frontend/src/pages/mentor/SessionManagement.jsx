// ==============================================
// SESSION MANAGEMENT PAGE - FULLY FUNCTIONAL
// ==============================================
// Mentor can view, schedule, and manage sessions

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/Modal';
import DataTable from '../../components/DataTable';

function SessionManagement() {
    const { user } = useAuth();
    const {
        sessions,
        addSession,
        updateSession,
        deleteSession,
        getSessionsByMentorId,
        fetchSessionsForMentor
    } = useData();

    const mentorId = user?.id || '';

    // Local mentees list, fetched directly from the backend
    const [myMentees, setMyMentees] = useState([]);

    // Fetch mentor's own sessions + their mentee list on mount
    useEffect(() => {
        if (!mentorId) return;

        // Fetch sessions from backend
        fetchSessionsForMentor(mentorId);

        // Fetch the mentor's assigned students directly using the dedicated endpoint
        fetch(`/api/studentmentoring/reports/mentor-wise-mentees/${mentorId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('smms_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            if (data && data.Students) {
                // Map to { id: EnrollmentNo, name: ..., EnrollmentNo: ... }
                setMyMentees(data.Students.map(s => ({
                    id: s.EnrollmentNo,
                    name: s.StudentName,
                    EnrollmentNo: s.EnrollmentNo,
                    StudentID: s.StudentID
                })));
            }
        })
        .catch(err => console.error('Failed to load mentees:', err));
    }, [mentorId]);

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [formData, setFormData] = useState({
        studentId: '',
        // Dates
        DateOfMentoring: '',
        ScheduledMeetingDate: '',
        NextMentoringDate: '',
        // Agenda & Issues
        MentoringMeetingAgenda: '',
        IssuesDiscussed: '',
        // Attendance
        AttendanceStatus: '',
        AbsentRemarks: '',
        // Parent Info
        IsParentPresent: false,
        ParentName: '',
        ParentMobileNo: '',
        // Opinions
        StudentsOpinion: '',
        ParentsOpinion: '',
        StaffOpinion: '',
        // Other
        StressLevel: '',
        LearnerType: '',
        MentoringDocument: '',
        Description: '',
    });

    // Get mentor's sessions
    const mySessions = getSessionsByMentorId(mentorId);

    // Helper to get real visual status for scheduled sessions
    const getSessionDisplayStatus = (session) => {
        if (session.status !== 'scheduled') return session.status;
        const sessionDate = new Date(`${session.date}T${session.time || '00:00'}`);
        return sessionDate < new Date() ? 'pending' : 'upcoming';
    };

    // Filter sessions
    const filteredSessions = statusFilter
        ? mySessions.filter(s => s.status === statusFilter)
        : mySessions;

    // Table columns
    const columns = [
        {
            key: 'session',
            label: 'Session',
            render: (item) => (
                <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-secondary">With {item.studentName}</p>
                </div>
            ),
        },
        {
            key: 'datetime',
            label: 'Date & Time',
            render: (item) => (
                <div>
                    <p className="text-sm font-medium">
                        {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-secondary">{item.time} • {item.duration} min</p>
                </div>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            render: (item) => <span className="text-sm">{item.location}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (item) => {
                const displayStatus = getSessionDisplayStatus(item);
                const badgeClass =
                    displayStatus === 'completed' ? 'badge-success' :
                    displayStatus === 'cancelled' ? 'badge-danger' :
                    displayStatus === 'pending'   ? 'badge-warning' :
                    'badge-primary'; // upcoming

                let displayLabel = item.status.charAt(0).toUpperCase() + item.status.slice(1);
                if (displayStatus === 'pending') displayLabel = 'Pending Action';
                if (displayStatus === 'upcoming') displayLabel = 'Upcoming';

                return (
                    <span className={`badge ${badgeClass}`}>
                        {displayLabel}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '120px',
            render: (item) => (
                <div className="flex gap-1">
                    {item.status === 'scheduled' && (
                        <>
                            <button
                                className="btn-icon"
                                onClick={(e) => { e.stopPropagation(); handleComplete(item.id); }}
                                title="Mark as completed"
                                style={{ color: 'var(--success)' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                            </button>
                            <button
                                className="btn-icon"
                                onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                title="Edit"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                            </button>
                        </>
                    )}
                    <button
                        className="btn-icon"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        title="Delete"
                        style={{ color: 'var(--danger)' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                </div>
            ),
        },
    ];

    // Handlers
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
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
        setIsModalOpen(true);
    };

    const handleEdit = (session) => {
        setIsEditMode(true);
        setSelectedSession(session);
        setFormData({
            studentId: session.studentId,
            DateOfMentoring: session.date || '',
            ScheduledMeetingDate: session.date || '',
            NextMentoringDate: session.NextMentoringDate || '',
            MentoringMeetingAgenda: session.title || '',
            IssuesDiscussed: session.notes || '',
            AttendanceStatus: session.AttendanceStatus || '',
            AbsentRemarks: session.AbsentRemarks || '',
            IsParentPresent: session.IsParentPresent || false,
            ParentName: session.ParentName || '',
            ParentMobileNo: session.ParentMobileNo || '',
            StudentsOpinion: session.StudentsOpinion || '',
            ParentsOpinion: session.ParentsOpinion || '',
            StaffOpinion: session.StaffOpinion || '',
            StressLevel: session.StressLevel || '',
            LearnerType: session.LearnerType || '',
            MentoringDocument: session.MentoringDocument || '',
            Description: session.Description || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const student = myMentees.find(m => m.id === formData.studentId);

        // Build the full payload matching every DB column
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

        try {
            if (isEditMode && selectedSession) {
                await updateSession(selectedSession.id, payload);
            } else {
                // createSessionApi expects (staffId, enrollmentNo, payload)
                const enrollmentNo = student?.EnrollmentNo || formData.studentId;
                const { createSessionApi } = await import('../../services/api');
                await createSessionApi(mentorId, enrollmentNo, payload);
                await fetchSessionsForMentor(mentorId);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert(`Failed to save session: ${err.message}`);
        }
    };

    const handleComplete = (sessionId) => {
        updateSession(sessionId, { status: 'completed' });
    };

    const handleDelete = (sessionId) => {
        if (confirm('Are you sure you want to delete this session?')) {
            deleteSession(sessionId);
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                            Session Management
                        </h1>
                        <p className="text-secondary">
                            Schedule and manage your mentoring sessions with students.
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Schedule Session
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center">
                    <select
                        className="input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">All Sessions</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <span className="text-sm text-secondary">
                        <strong>{filteredSessions.length}</strong> sessions found
                    </span>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredSessions.sort((a, b) => new Date(b.date) - new Date(a.date))}
                emptyMessage="No sessions found"
                emptyIcon="event_busy"
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? 'Edit Session' : 'Schedule New Session'}
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
                            {myMentees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
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
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Schedule'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default SessionManagement;
