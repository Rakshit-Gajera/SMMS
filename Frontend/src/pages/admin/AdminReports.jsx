// ==============================================
// ADMIN REPORTS PAGE - FULLY FUNCTIONAL
// ==============================================
// Uses real data from DataContext.
// Export buttons generate downloadable HTML files.

import { useData } from '../../context/DataContext';

// ==============================================
// ADMIN REPORTS COMPONENT
// ==============================================
function AdminReports() {
    const { users, sessions, getMentors, getStudents, getMenteesByMentorId } = useData();

    const mentors = getMentors();
    const students = getStudents();
    const allSessions = sessions;

    // Build mentor stats
    const mentorStats = mentors.map(m => {
        const mentees = getMenteesByMentorId(m.id);
        const mentorSessions = allSessions.filter(s => s.mentorId === m.id);
        const completed = mentorSessions.filter(s => s.status === 'completed').length;
        const total = mentorSessions.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const lastSession = mentorSessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return {
            ...m,
            menteeCount: mentees.length,
            completedSessions: completed,
            totalSessions: total,
            progress,
            lastSessionDate: lastSession?.date || 'N/A',
        };
    });

    // KPI stats
    const totalMentors = mentors.length;
    const activeMentees = students.length;
    const meetingsDone = allSessions.filter(s => s.status === 'completed').length;
    const avgProgress = mentorStats.length > 0
        ? Math.round(mentorStats.reduce((sum, m) => sum + m.progress, 0) / mentorStats.length)
        : 0;

    // Export as HTML report
    const handleExport = (format) => {
        console.log(`[AdminReports] Export ${format} clicked`);
        const rows = mentorStats.map(m => `
            <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${m.name}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${m.department}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${m.menteeCount}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${m.progress}%</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${m.lastSessionDate}</td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SMMS Admin Report</title></head>
<body style="font-family:Arial,sans-serif;max-width:900px;margin:40px auto;color:#111827">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:32px;border-radius:12px;margin-bottom:32px">
        <h1 style="margin:0 0 8px">SMMS Admin Report</h1>
        <p style="margin:0;opacity:0.85">Generated: ${new Date().toLocaleDateString()}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px">
        <div style="background:#e8f0fe;border-radius:10px;padding:16px;text-align:center"><p style="font-size:28px;font-weight:800;color:#2b6cee;margin:0">${totalMentors}</p><p style="font-size:13px;color:#6b7280;margin:4px 0 0">Mentors</p></div>
        <div style="background:#f3e8ff;border-radius:10px;padding:16px;text-align:center"><p style="font-size:28px;font-weight:800;color:#9333ea;margin:0">${activeMentees}</p><p style="font-size:13px;color:#6b7280;margin:4px 0 0">Students</p></div>
        <div style="background:#fef3c7;border-radius:10px;padding:16px;text-align:center"><p style="font-size:28px;font-weight:800;color:#d97706;margin:0">${meetingsDone}</p><p style="font-size:13px;color:#6b7280;margin:4px 0 0">Sessions Done</p></div>
        <div style="background:#d1fae5;border-radius:10px;padding:16px;text-align:center"><p style="font-size:28px;font-weight:800;color:#059669;margin:0">${avgProgress}%</p><p style="font-size:13px;color:#6b7280;margin:4px 0 0">Avg Progress</p></div>
    </div>
    <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1)">
        <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white">
            <th style="padding:12px;text-align:left">Mentor</th><th style="padding:12px;text-align:left">Department</th>
            <th style="padding:12px;text-align:center">Mentees</th><th style="padding:12px;text-align:center">Progress</th><th style="padding:12px;text-align:left">Last Session</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:32px;color:#9ca3af;font-size:12px;text-align:center">SMMS – Student Mentoring Management System</p>
</body></html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SMMS_Admin_Report_${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getProgressColor = (p) => p >= 80 ? '#10b981' : p >= 50 ? '#2b6cee' : '#f59e0b';

    return (
        <div className="animate-fadeIn">
            {/* PAGE HEADER */}
            <div className="flex items-end justify-between animate-fadeInUp" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                        Reports & Analytics
                    </h1>
                    <p className="text-secondary">
                        Analytics and performance tracking for mentorship programs.
                    </p>
                </div>

                {/* Export buttons - now functional! */}
                <div className="flex gap-3">
                    <button className="btn btn-secondary" onClick={() => handleExport('pdf')}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>picture_as_pdf</span>
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI SUMMARY CARDS - Real data */}
            <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stats-card animate-fadeInUp delay-200">
                    <div>
                        <p className="stats-card-label">Total Mentors</p>
                        <h3 className="stats-card-value">{totalMentors}</h3>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#e8f0fe', color: '#2b6cee' }}>
                        <span className="material-symbols-outlined">school</span>
                    </div>
                </div>
                <div className="stats-card animate-fadeInUp delay-300">
                    <div>
                        <p className="stats-card-label">Active Students</p>
                        <h3 className="stats-card-value">{activeMentees}</h3>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                </div>
                <div className="stats-card animate-fadeInUp delay-400">
                    <div>
                        <p className="stats-card-label">Sessions Completed</p>
                        <h3 className="stats-card-value">{meetingsDone}</h3>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                        <span className="material-symbols-outlined">event_available</span>
                    </div>
                </div>
                <div className="stats-card animate-fadeInUp delay-500">
                    <div>
                        <p className="stats-card-label">Avg. Progress</p>
                        <h3 className="stats-card-value">{avgProgress}%</h3>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
                        <span className="material-symbols-outlined">donut_large</span>
                    </div>
                </div>
            </div>

            {/* MENTOR LIST TABLE - Real data */}
            <div className="card animate-fadeInUp delay-600" style={{ overflow: 'hidden' }}>
                <div
                    className="flex items-center justify-between"
                    style={{
                        padding: 'var(--space-4) var(--space-6)',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid var(--border-light)',
                    }}
                >
                    <h3 className="font-semibold">Mentor Overview ({mentorStats.length})</h3>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Mentor Name</th>
                            <th>Department</th>
                            <th style={{ textAlign: 'center' }}>Mentees</th>
                            <th>Progress</th>
                            <th>Last Session</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mentorStats.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                    No mentors found in the system
                                </td>
                            </tr>
                        ) : (
                            mentorStats.map((mentor) => (
                                <tr key={mentor.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="avatar avatar-initials"
                                                style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}
                                            >
                                                {mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{mentor.name}</p>
                                                <p className="text-xs text-secondary">{mentor.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{mentor.department}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{mentor.menteeCount}</td>
                                    <td>
                                        <div style={{ width: '100px' }}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium" style={{ color: getProgressColor(mentor.progress) }}>
                                                    {mentor.progress}%
                                                </span>
                                            </div>
                                            <div style={{
                                                width: '100%', height: '6px',
                                                backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    width: `${mentor.progress}%`, height: '100%',
                                                    backgroundColor: getProgressColor(mentor.progress), borderRadius: '3px',
                                                }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-sm text-secondary">
                                        {mentor.lastSessionDate !== 'N/A'
                                            ? new Date(mentor.lastSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : 'No sessions'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminReports;
