// ==============================================
// MENTEE LIST PAGE - FULLY FUNCTIONAL
// ==============================================
// Mentor can view all their assigned mentees
// Fetches from /api/staff/:staffId/mentees directly (not from DataContext users)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

function MenteeList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getSessionsByStudentId, updateUser, addTask, fetchTasksForMentor } = useData();

    // State
    const [myMentees, setMyMentees] = useState([]);
    const [menteesLoading, setMenteesLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', priority: 'medium' });
    const [taskSubmitting, setTaskSubmitting] = useState(false);
    const [taskMessage, setTaskMessage] = useState(null); // { type: 'success'|'error', text }

    const mentorId = user?.id;

    // Fetch mentees directly from the backend (not from DataContext)
    useEffect(() => {
        if (!mentorId) {
            console.warn('[MenteeList] No mentorId — user not logged in yet');
            setMenteesLoading(false);
            return;
        }

        console.log(`[MenteeList] Fetching mentees for mentorId=${mentorId} from /api/staff/${mentorId}/mentees`);
        setMenteesLoading(true);

        fetch(`/api/staff/${mentorId}/mentees`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('smms_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(r => {
            console.log(`[MenteeList] /api/staff/${mentorId}/mentees → HTTP ${r.status}`);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then(data => {
            console.log('[MenteeList] Raw mentees data from API:', data);
            // The endpoint returns an array of student records
            const mapped = (Array.isArray(data) ? data : []).map(s => ({
                id: s.EnrollmentNo,
                name: s.StudentName,
                email: s.EmailAddress || '',
                department: s.Description || 'Student',
                status: 'active',
                EnrollmentNo: s.EnrollmentNo,
                StudentID: s.StudentID,
            }));
            console.log(`[MenteeList] Mapped ${mapped.length} mentees:`, mapped);
            setMyMentees(mapped);
        })
        .catch(err => {
            console.error('[MenteeList] Failed to load mentees:', err);
            setMyMentees([]);
        })
        .finally(() => {
            setMenteesLoading(false);
            // Also pre-load tasks assigned by this mentor
            if (mentorId) fetchTasksForMentor(mentorId);
        });
    }, [mentorId]);

    // Filter mentees
    const filteredMentees = myMentees.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Table columns
    const columns = [
        {
            key: 'student',
            label: 'Student',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div
                        className="avatar avatar-initials"
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: item.status === 'active' ? '#d1fae5' : '#fef3c7',
                            color: item.status === 'active' ? '#059669' : '#d97706',
                        }}
                    >
                        {item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-secondary">{item.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'enrollmentNo',
            label: 'Enrollment No.',
            render: (item) => <span className="text-sm font-mono">{item.EnrollmentNo}</span>,
        },
        {
            key: 'department',
            label: 'Department',
            render: (item) => <span className="text-sm">{item.department}</span>,
        },
        {
            key: 'sessions',
            label: 'Sessions',
            render: (item) => {
                const studentSessions = getSessionsByStudentId(item.id);
                return (
                    <span className="text-sm">
                        {studentSessions.filter(s => s.status === 'completed').length} completed
                    </span>
                );
            },
        },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className={`status-dot ${item.status}`}></span>
                    <span className={`text-sm font-medium ${item.status === 'active' ? 'text-success' : 'text-warning'}`}>
                        {item.status === 'active' ? 'On Track' : 'Needs Attention'}
                    </span>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '150px',
            render: (item) => (
                <div className="flex gap-1">
                    <button
                        className="btn-icon"
                        onClick={(e) => { e.stopPropagation(); openTaskModal(item); }}
                        title="Assign task"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_task</span>
                    </button>
                    <button
                        className="btn-icon"
                        onClick={(e) => { e.stopPropagation(); navigate('/mentor/sessions'); }}
                        title="Schedule session"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>event</span>
                    </button>
                </div>
            ),
        },
    ];

    // Handlers
    const openTaskModal = (mentee) => {
        setSelectedMentee(mentee);
        setTaskForm({ title: '', dueDate: '', priority: 'medium' });
        setIsTaskModalOpen(true);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        setTaskSubmitting(true);
        setTaskMessage(null);
        try {
            await addTask({
                ...taskForm,
                assignedTo: selectedMentee.EnrollmentNo || selectedMentee.id,
                assignedBy: mentorId,
            });
            setTaskMessage({ type: 'success', text: `Task assigned to ${selectedMentee.name}!` });
            setTaskForm({ title: '', dueDate: '', priority: 'medium' });
            // Reload mentor tasks from backend
            fetchTasksForMentor(mentorId);
            setTimeout(() => {
                setIsTaskModalOpen(false);
                setTaskMessage(null);
            }, 1500);
        } catch (err) {
            setTaskMessage({ type: 'error', text: 'Failed to assign task: ' + err.message });
        } finally {
            setTaskSubmitting(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
                            My Mentees
                        </h1>
                        <p className="text-secondary">
                            View and manage your assigned mentees.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4 items-center">
                    <div style={{ position: 'relative', maxWidth: '400px', flex: 1 }}>
                        <span className="material-symbols-outlined text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>search</span>
                        <input
                            type="text"
                            className="input"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '44px' }}
                        />
                    </div>
                    <span className="text-sm text-secondary">
                        {menteesLoading
                            ? 'Loading mentees...'
                            : <><strong>{filteredMentees.length}</strong> mentees</>
                        }
                    </span>
                </div>
            </div>

            {/* Loading state */}
            {menteesLoading && (
                <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                    <p className="text-secondary">Loading your mentees...</p>
                </div>
            )}

            {/* Table */}
            {!menteesLoading && (
                <DataTable
                    columns={columns}
                    data={filteredMentees}
                    emptyMessage="No mentees assigned"
                    emptyIcon="groups"
                />
            )}

            {/* Assign Task Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={`Assign Task to ${selectedMentee?.name || 'Student'}`}
                icon="add_task"
            >
                <form onSubmit={handleAddTask}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Task Title</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., Complete self-assessment form"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                        <div>
                            <label className="label">Due Date</label>
                            <input
                                type="date"
                                className="input"
                                value={taskForm.dueDate}
                                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Priority</label>
                            <select
                                className="input"
                                value={taskForm.priority}
                                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    {taskMessage && (
                        <div style={{
                            marginBottom: 'var(--space-4)',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: taskMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                            color: taskMessage.type === 'success' ? '#065f46' : '#991b1b',
                            fontSize: '0.875rem',
                        }}>
                            {taskMessage.text}
                        </div>
                    )}
                    <div className="flex gap-3 justify-end">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={taskSubmitting}>
                            {taskSubmitting ? 'Assigning...' : 'Assign Task'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default MenteeList;
