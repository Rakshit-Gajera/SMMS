// ==============================================
// STUDENT SESSIONS PAGE - FULLY FUNCTIONAL
// ==============================================
// Student can view past and upcoming sessions

import { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/DataTable';

function StudentSessions() {
    const { user } = useAuth();
    const { getSessionsByStudentId, fetchSessionsForStudent } = useData();

    // State
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const enrollmentNo = user?.id || '';

    // Fetch sessions from backend on mount
    useEffect(() => {
        if (!enrollmentNo) return;
        console.log(`[StudentSessions] Fetching sessions for enrollmentNo=${enrollmentNo}`);
        setLoading(true);
        fetchSessionsForStudent(enrollmentNo).finally(() => setLoading(false));
    }, [enrollmentNo]);

    // Get student's sessions from context
    const studentId = enrollmentNo;
    const mySessions = getSessionsByStudentId(studentId);
    console.log('[StudentSessions] mySessions:', mySessions.length);

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
                    <p className="text-xs text-secondary">With {item.mentorName}</p>
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
            render: (item) => (
                <span className={`badge ${item.status === 'completed' ? 'badge-success' : item.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            ),
        },
        {
            key: 'notes',
            label: 'Notes',
            render: (item) => (
                <span className="text-sm text-secondary">
                    {item.notes || '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                            My Sessions
                        </h1>
                        <p className="text-secondary">
                            View your past and upcoming mentoring sessions.
                        </p>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="flex gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">event</span>
                        <span className="text-sm">
                            <strong>{mySessions.filter(s => s.status === 'scheduled').length}</strong> upcoming
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-success">check_circle</span>
                        <span className="text-sm">
                            <strong>{mySessions.filter(s => s.status === 'completed').length}</strong> completed
                        </span>
                    </div>
                    {loading && <span className="text-sm text-secondary">Loading...</span>}
                </div>

                {/* Filter */}
                <div className="flex gap-4 items-center">
                    <select
                        className="input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">All Sessions</option>
                        <option value="scheduled">Upcoming</option>
                        <option value="pending">Needs Action</option>
                        <option value="completed">Completed</option>
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
        </div>
    );
}

export default StudentSessions;
