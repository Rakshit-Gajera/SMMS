// ==============================================
// STUDENT REPORTS PAGE - FULLY FUNCTIONAL
// ==============================================
// View, Download, and Refresh all work using real
// mentoring session data from the backend API.

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

// ==============================================
// HELPERS
// ==============================================

/** Group sessions into report "periods" - one report per semester */
function buildReports(sessions) {
    if (!sessions || sessions.length === 0) return [];

    // Sort by date
    const sorted = [...sessions].sort((a, b) =>
        new Date(a.DateOfMentoring) - new Date(b.DateOfMentoring)
    );

    // Group by year
    const byYear = {};
    sorted.forEach(s => {
        const year = new Date(s.DateOfMentoring).getFullYear();
        if (!byYear[year]) byYear[year] = [];
        byYear[year].push(s);
    });

    return Object.entries(byYear).map(([year, sess]) => {
        const dates = sess.map(s => new Date(s.DateOfMentoring));
        const from = dates[0].toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        const to = dates[dates.length - 1].toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        const generated = dates[dates.length - 1].toISOString().split('T')[0];
        return {
            id: year,
            title: `Mentoring Report ${year}`,
            period: `${from} - ${to}`,
            generatedDate: generated,
            sessions: sess,
        };
    });
}

/** Build a styled HTML string for a report (used for both View and Download) */
function buildReportHTML(report, studentName, mentorName) {
    const sessionRows = report.sessions.map((s, i) => `
        <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${s.DateOfMentoring || '-'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${s.AttendanceStatus || 'Present'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${s.IssuesDiscussed || '-'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${s.StressLevel || '-'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${s.StaffOpinion || '-'}</td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${report.title}</title></head>
<body style="font-family:Arial,sans-serif;max-width:900px;margin:40px auto;color:#111827">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:32px;border-radius:12px;margin-bottom:32px">
        <h1 style="margin:0 0 8px">${report.title}</h1>
        <p style="margin:0;opacity:0.85">Period: ${report.period} &nbsp;•&nbsp; Generated: ${report.generatedDate}</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
        <div style="background:#f3f4f6;border-radius:10px;padding:20px">
            <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Student</p>
            <p style="margin:0;font-size:18px;font-weight:700">${studentName}</p>
        </div>
        <div style="background:#f3f4f6;border-radius:10px;padding:20px">
            <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Assigned Mentor</p>
            <p style="margin:0;font-size:18px;font-weight:700">${mentorName}</p>
        </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px">
        <div style="background:#e8f5e9;border-radius:10px;padding:16px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:800;color:#2e7d32">${report.sessions.length}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#4caf50">Total Sessions</p>
        </div>
        <div style="background:#e3f2fd;border-radius:10px;padding:16px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:800;color:#1565c0">${report.sessions.filter(s => s.AttendanceStatus === 'Present').length}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#2196f3">Present</p>
        </div>
        <div style="background:#fce4ec;border-radius:10px;padding:16px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:800;color:#c62828">${report.sessions.filter(s => s.AttendanceStatus === 'Absent').length}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#e91e63">Absent</p>
        </div>
    </div>

    <h2 style="font-size:18px;font-weight:700;margin-bottom:12px">Session Details</h2>
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1)">
        <thead>
            <tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white">
                <th style="padding:12px;text-align:left;font-size:13px">Date</th>
                <th style="padding:12px;text-align:left;font-size:13px">Attendance</th>
                <th style="padding:12px;text-align:left;font-size:13px">Issues Discussed</th>
                <th style="padding:12px;text-align:left;font-size:13px">Stress Level</th>
                <th style="padding:12px;text-align:left;font-size:13px">Mentor's Opinion</th>
            </tr>
        </thead>
        <tbody>${sessionRows}</tbody>
    </table>

    <p style="margin-top:32px;color:#9ca3af;font-size:12px;text-align:center">
        Generated by SMMS – Student Mentoring Management System &nbsp;•&nbsp; ${new Date().toLocaleDateString()}
    </p>
</body>
</html>`;
}

// ==============================================
// MAIN COMPONENT
// ==============================================
function StudentReports() {
    const { user } = useAuth();
    const { getSessionsByStudentId } = useData();

    const [sessions, setSessions] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewingReport, setViewingReport] = useState(null); // report being viewed in modal

    const studentEnrollment = user?.id;
    const studentName = user?.name || 'Student';

    // Derive mentor name from first session if available
    const mentorName = sessions[0]?.StaffName || 'Assigned Mentor';

    // Load mentoring history from DataContext
    const loadReports = () => {
        if (!studentEnrollment) return;
        setLoading(true);
        setError('');
        try {
            console.log('[StudentReports] Fetching mentoring history from DataContext for:', studentEnrollment);
            const mySessions = getSessionsByStudentId(studentEnrollment);
            
            // Map DataContext simple sessions to the verbose format expected by the HTML report
            const mappedSessions = mySessions.map(s => ({
                DateOfMentoring: s.date,
                AttendanceStatus: s.status === 'completed' ? 'Present' : (s.status === 'cancelled' ? 'Absent' : 'Scheduled'),
                IssuesDiscussed: s.notes || s.title || '-',
                StressLevel: '-',
                StaffOpinion: '-',
                StaffName: s.mentorName
            }));
            
            console.log('[StudentReports] Got mapped sessions:', mappedSessions);
            setSessions(mappedSessions);
            setReports(buildReports(mappedSessions));
        } catch (err) {
            console.error('[StudentReports] Failed to load:', err.message);
            setError('Could not load reports: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReports(); }, [studentEnrollment]);

    // ---- HANDLERS ----

    const handleView = (report) => {
        console.log('[StudentReports] View clicked for:', report.title);
        setViewingReport(report);
    };

    const handleDownload = (report) => {
        console.log('[StudentReports] Download clicked for:', report.title);
        const html = buildReportHTML(report, studentName, mentorName);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRefresh = () => {
        console.log('[StudentReports] Refresh clicked');
        loadReports();
    };

    // ========================
    // RENDER
    // ========================
    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                    My Reports
                </h1>
                <p className="text-secondary">
                    View your personal progress reports and mentoring analytics.
                </p>
            </div>

            {/* Stats from real sessions */}
            <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stats-card">
                    <div>
                        <p className="stats-card-label">Sessions Attended</p>
                        <h3 className="stats-card-value">
                            {sessions.filter(s => s.AttendanceStatus === 'Present').length}/{sessions.length}
                        </h3>
                        <p className="text-xs text-success font-medium" style={{ marginTop: 'var(--space-1)' }}>
                            {sessions.length > 0
                                ? Math.round((sessions.filter(s => s.AttendanceStatus === 'Present').length / sessions.length) * 100)
                                : 0}% attendance
                        </p>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#e8f0fe', color: '#2b6cee' }}>
                        <span className="material-symbols-outlined">event_available</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <p className="stats-card-label">Total Sessions</p>
                        <h3 className="stats-card-value">{sessions.length}</h3>
                        <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
                            All time
                        </p>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
                        <span className="material-symbols-outlined">task_alt</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <p className="stats-card-label">Reports Available</p>
                        <h3 className="stats-card-value">{reports.length}</h3>
                        <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
                            {reports.length > 0 ? 'Ready to download' : 'No reports yet'}
                        </p>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                        <span className="material-symbols-outlined">description</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <p className="stats-card-label">Absent Count</p>
                        <h3 className="stats-card-value">{sessions.filter(s => s.AttendanceStatus === 'Absent').length}</h3>
                        <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
                            Sessions missed
                        </p>
                    </div>
                    <div className="stats-card-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                        <span className="material-symbols-outlined">event_busy</span>
                    </div>
                </div>
            </div>

            {/* Available Reports */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Available Reports</h3>
                    <button className="btn btn-secondary" onClick={handleRefresh} disabled={loading}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>refresh</span>
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {/* Error state */}
                {error && (
                    <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#dc2626', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center p-6 text-secondary">
                        <span className="material-symbols-outlined" style={{ fontSize: '40px', opacity: 0.4 }}>hourglass_top</span>
                        <p className="mt-2">Loading your reports...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && reports.length === 0 && !error && (
                    <div className="text-center p-6 text-secondary">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.4 }}>folder_open</span>
                        <p className="mt-2">No mentoring sessions recorded yet.</p>
                        <p className="text-sm mt-1">Reports are generated automatically once sessions are logged.</p>
                    </div>
                )}

                {/* Report list */}
                {!loading && (
                    <div className="flex flex-col gap-3">
                        {reports.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div style={{
                                        width: '48px', height: '48px',
                                        backgroundColor: 'var(--primary-light)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span className="material-symbols-outlined text-primary">description</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{report.title}</h4>
                                        <p className="text-sm text-secondary">
                                            Period: {report.period} • Generated: {report.generatedDate} • {report.sessions.length} session(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-secondary" onClick={() => handleView(report)}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                                        View
                                    </button>
                                    <button className="btn btn-primary" onClick={() => handleDownload(report)}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* VIEW MODAL */}
            {viewingReport && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '24px',
                    }}
                    onClick={() => setViewingReport(null)}
                >
                    <div
                        style={{
                            background: '#fff', borderRadius: '16px',
                            width: '100%', maxWidth: '800px', maxHeight: '90vh',
                            overflow: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div style={{
                            padding: '20px 24px',
                            background: 'linear-gradient(135deg,#667eea,#764ba2)',
                            color: 'white', borderRadius: '16px 16px 0 0',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{viewingReport.title}</h2>
                                <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.85rem' }}>
                                    Period: {viewingReport.period}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn btn-secondary"
                                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
                                    onClick={() => handleDownload(viewingReport)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                                    Download
                                </button>
                                <button
                                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                                    onClick={() => setViewingReport(null)}
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal body */}
                        <div style={{ padding: '24px' }}>
                            {/* Summary cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
                                {[
                                    { label: 'Total Sessions', value: viewingReport.sessions.length, bg: '#e8f5e9', color: '#2e7d32' },
                                    { label: 'Present', value: viewingReport.sessions.filter(s => s.AttendanceStatus === 'Present').length, bg: '#e3f2fd', color: '#1565c0' },
                                    { label: 'Absent', value: viewingReport.sessions.filter(s => s.AttendanceStatus === 'Absent').length, bg: '#fce4ec', color: '#c62828' },
                                ].map(card => (
                                    <div key={card.label} style={{ background: card.bg, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: card.color }}>{card.value}</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: card.color }}>{card.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Sessions table */}
                            <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Session Details</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ background: '#f3f4f6' }}>
                                            {['Date', 'Attendance', 'Issues Discussed', 'Stress Level', "Mentor's Opinion"].map(h => (
                                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewingReport.sessions.map((s, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{s.DateOfMentoring || '-'}</td>
                                                <td style={{ padding: '10px 12px' }}>
                                                    <span style={{
                                                        padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                                                        background: s.AttendanceStatus === 'Present' ? '#d1fae5' : '#fee2e2',
                                                        color: s.AttendanceStatus === 'Present' ? '#065f46' : '#991b1b',
                                                    }}>
                                                        {s.AttendanceStatus || 'Present'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 12px', maxWidth: '200px' }}>{s.IssuesDiscussed || '-'}</td>
                                                <td style={{ padding: '10px 12px' }}>{s.StressLevel || '-'}</td>
                                                <td style={{ padding: '10px 12px', maxWidth: '200px' }}>{s.StaffOpinion || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentReports;
