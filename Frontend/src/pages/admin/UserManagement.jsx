// ==============================================
// USER MANAGEMENT PAGE - FULLY FUNCTIONAL
// ==============================================
// Uses DataContext for persistent user data
// All CRUD operations work and persist to localStorage

import { useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useData } from '../../context/DataContext';

// ==============================================
// USER MANAGEMENT COMPONENT
// ==============================================
function UserManagement() {
    // Get data and operations from context
    const { users, addUser, updateUser, deleteUser, getMentors, assignMentorToStudent } = useData();

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // New user form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        status: 'active',
        MobileNo: '',
        enrollmentOrStaffId: '',  // EnrollmentNo for students, StaffID for staff
    });

    // Get unique departments for filter
    const departments = [...new Set(users.map(u => u.department))];

    // ==============================================
    // FILTER LOGIC
    // ==============================================
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesDept = !deptFilter || user.department === deptFilter;
        return matchesSearch && matchesRole && matchesDept;
    });

    // ==============================================
    // TABLE COLUMN DEFINITIONS
    // ==============================================
    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div
                        className="avatar avatar-initials"
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: item.role === 'mentor' ? '#e8f0fe' :
                                item.role === 'admin' ? '#f3e8ff' : '#f1f5f9',
                            color: item.role === 'mentor' ? '#2b6cee' :
                                item.role === 'admin' ? '#9333ea' : '#64748b',
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
            key: 'role',
            label: 'Role',
            render: (item) => (
                <span className={`badge badge-${item.role === 'mentor' ? 'primary' :
                    item.role === 'admin' ? 'purple' : 'gray'
                    }`}
                    style={{
                        backgroundColor: item.role === 'admin' ? '#f3e8ff' : undefined,
                        color: item.role === 'admin' ? '#9333ea' : undefined,
                    }}>
                    {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                </span>
            ),
        },
        {
            key: 'department',
            label: 'Department',
            render: (item) => (
                <span className="text-sm text-secondary">{item.department}</span>
            ),
        },
        {
            key: 'mentorship',
            label: 'Mentorship',
            render: (item) => {
                if (item.role === 'mentor') {
                    return <span className="text-sm">{item.menteeCount || 0} mentees</span>;
                } else if (item.role === 'student') {
                    if (item.mentorName) {
                        // Already has a mentor — show name + Change button
                        return (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-secondary">{item.mentorName}</span>
                                <button
                                    className="badge badge-primary"
                                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUser(item);
                                        setIsAssignModalOpen(true);
                                    }}
                                    title="Change mentor"
                                >
                                    Change
                                </button>
                            </div>
                        );
                    } else {
                        return (
                            <button
                                className="badge badge-warning"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(item);
                                    setIsAssignModalOpen(true);
                                }}
                            >
                                Assign Mentor
                            </button>
                        );
                    }
                }
                return <span className="text-sm text-muted">-</span>;
            },
        },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className={`status-dot ${item.status}`}></span>
                    <span className={`text-sm font-medium ${item.status === 'active' ? 'text-success' : 'text-muted'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '80px',
            render: (item) => (
                <div className="flex gap-1">
                    <button
                        className="btn-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                        }}
                        title="Edit user"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            edit
                        </span>
                    </button>
                    <button
                        className="btn-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                        }}
                        title="Delete user"
                        style={{ color: 'var(--danger)' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            delete
                        </span>
                    </button>
                </div>
            ),
        },
    ];

    // ==============================================
    // HANDLERS
    // ==============================================
    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: user.password || '',
            role: user.role,
            department: user.department,
            status: user.status,
            MobileNo: user.MobileNo || '',
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (userId) => {
        console.log('[UserManagement] handleDelete called for userId:', userId);
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
            console.log('[UserManagement] deleteUser called for:', userId);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        console.log('[UserManagement] handleAddUser called with formData:', formData);

        // Build the correct payload based on role
        const payload = {
            ...formData,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            role: formData.role,
            MobileNo: formData.MobileNo,
        };

        if (formData.role === 'student') {
            payload.EnrollmentNo = formData.enrollmentOrStaffId;
            payload.id = formData.enrollmentOrStaffId;
        } else {
            payload.StaffID = formData.enrollmentOrStaffId;
            payload.id = formData.enrollmentOrStaffId;
        }

        console.log('[UserManagement] Sending to addUser:', payload);
        try {
            await addUser(payload);
            console.log('[UserManagement] addUser success!');
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'student', department: '', status: 'active', MobileNo: '', enrollmentOrStaffId: '' });
        } catch (err) {
            console.error('[UserManagement] addUser FAILED:', err.message);
            alert('Failed to add user: ' + err.message);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        console.log('[UserManagement] handleUpdateUser for user:', selectedUser?.id, 'with data:', formData);
        try {
            await updateUser(selectedUser.id, formData);
            console.log('[UserManagement] updateUser success!');
            setIsEditModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('[UserManagement] updateUser FAILED:', err.message);
            alert('Failed to update user: ' + err.message);
        }
    };

    const handleAssignMentor = (mentorId) => {
        const mentor = getMentors().find(m => m.id === mentorId);
        if (mentor && selectedUser) {
            assignMentorToStudent(selectedUser.id, mentorId);
            setIsAssignModalOpen(false);
            setSelectedUser(null);
        }
    };

    // ==============================================
    // RENDER
    // ==============================================
    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div
                className="card"
                style={{
                    padding: 'var(--space-6)',
                    marginBottom: 'var(--space-6)',
                }}
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
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
                            User Management
                        </h1>
                        <p className="text-secondary animate-fadeInUp delay-100">
                            Manage faculty mentors and student accounts, assignments, roles, and access permissions.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                add
                            </span>
                            Add New User
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-end">
                    <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <span
                            className="material-symbols-outlined text-muted"
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        >
                            search
                        </span>
                        <input
                            type="text"
                            className="input"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '44px' }}
                        />
                    </div>

                    <div style={{ width: '180px' }}>
                        <select
                            className="input"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="mentor">Mentor</option>
                            <option value="student">Student</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div style={{ width: '180px' }}>
                        <select
                            className="input"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <span className="text-sm text-secondary">
                        <strong>{filteredUsers.length}</strong> users found
                    </span>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredUsers}
                selectable={true}
            />

            {/* Add User Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
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
                            value={formData.name}
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
                            value={formData.email}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Role</label>
                        <select
                            name="role"
                            className="input"
                            value={formData.role}
                            onChange={handleFormChange}
                        >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">
                            {formData.role === 'student' ? 'Enrollment No' : 'Staff ID'}
                        </label>
                        <input
                            type="text"
                            name="enrollmentOrStaffId"
                            className="input"
                            placeholder={formData.role === 'student' ? 'e.g. 22CS001' : 'e.g. STAFF002'}
                            value={formData.enrollmentOrStaffId}
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
                            value={formData.department}
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
                            value={formData.MobileNo}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label className="label">Status</label>
                        <select
                            name="status"
                            className="input"
                            value={formData.status}
                            onChange={handleFormChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add User
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User"
                icon="edit"
            >
                <form onSubmit={handleUpdateUser}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            value={formData.name}
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
                            value={formData.email}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Password</label>
                        <input
                            type="text"
                            name="password"
                            className="input"
                            placeholder="Leave empty to keep current password"
                            value={formData.password}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Role</label>
                        <select
                            name="role"
                            className="input"
                            value={formData.role}
                            onChange={handleFormChange}
                        >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="label">Department</label>
                        <input
                            type="text"
                            name="department"
                            className="input"
                            value={formData.department}
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
                            value={formData.MobileNo}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label className="label">Status</label>
                        <select
                            name="status"
                            className="input"
                            value={formData.status}
                            onChange={handleFormChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Assign Mentor Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title={`Assign Mentor to ${selectedUser?.name || 'Student'}`}
                icon="link"
            >
                <p className="text-secondary mb-4">Select a mentor to assign:</p>
                <div className="flex flex-col gap-3">
                    {getMentors().map(mentor => (
                        <button
                            key={mentor.id}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                            style={{
                                backgroundColor: 'var(--bg-main)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onClick={() => handleAssignMentor(mentor.id)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                        >
                            <div className="avatar avatar-initials" style={{ width: '40px', height: '40px' }}>
                                {mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <p className="text-sm font-medium">{mentor.name}</p>
                                <p className="text-xs text-secondary">{mentor.department} • {mentor.menteeCount || 0} mentees</p>
                            </div>
                            <span className="material-symbols-outlined text-primary">arrow_forward</span>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default UserManagement;
