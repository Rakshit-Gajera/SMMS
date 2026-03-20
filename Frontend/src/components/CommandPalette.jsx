// ==============================================
// COMMAND PALETTE - SPOTLIGHT SEARCH COMPONENT
// ==============================================
// A global search modal (Cmd+K / Ctrl+K) that provides:
// - Quick search across users, sessions, tasks
// - Quick actions for navigation
// - Keyboard navigation support
// - Categorized results with icons

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// ==============================================
// COMMAND PALETTE COMPONENT
// ==============================================
function CommandPalette({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { users, sessions, tasks } = useData();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSearchQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Define quick actions based on user role
    const quickActions = useMemo(() => {
        const baseActions = [
            { id: 'dashboard', label: 'Go to Dashboard', icon: 'dashboard', path: `/${user?.role}` },
        ];

        if (user?.role === 'admin') {
            return [
                ...baseActions,
                { id: 'users', label: 'Manage Users', icon: 'group', path: '/admin/users' },
                { id: 'reports', label: 'View Reports', icon: 'analytics', path: '/admin/reports' },
                { id: 'add-user', label: 'Add New User', icon: 'person_add', path: '/admin/users', action: 'add' },
            ];
        } else if (user?.role === 'mentor') {
            return [
                ...baseActions,
                { id: 'mentees', label: 'View Mentees', icon: 'groups', path: '/mentor/mentees' },
                { id: 'sessions', label: 'Manage Sessions', icon: 'event', path: '/mentor/sessions' },
                { id: 'tasks', label: 'View Tasks', icon: 'task_alt', path: '/mentor/tasks' },
                { id: 'feedback', label: 'Give Feedback', icon: 'rate_review', path: '/mentor/feedback' },
            ];
        } else {
            return [
                ...baseActions,
                { id: 'mentor-info', label: 'My Mentor Info', icon: 'school', path: '/student/mentor' },
                { id: 'my-sessions', label: 'My Sessions', icon: 'event', path: '/student/sessions' },
                { id: 'my-tasks', label: 'My Tasks', icon: 'task_alt', path: '/student/tasks' },
                { id: 'my-reports', label: 'My Reports', icon: 'assessment', path: '/student/reports' },
            ];
        }
    }, [user?.role]);

    // Build search results
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) {
            // Show quick actions when no search query
            return quickActions.map(action => ({
                ...action,
                category: 'Quick Actions',
                type: 'action',
            }));
        }

        const query = searchQuery.toLowerCase();
        const results = [];

        // Search users (for admins and mentors)
        if (user?.role === 'admin' || user?.role === 'mentor') {
            const filteredUsers = users.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.role.toLowerCase().includes(query)
            ).slice(0, 5);

            filteredUsers.forEach(u => {
                results.push({
                    id: `user-${u.id}`,
                    label: u.name,
                    sublabel: `${u.role.charAt(0).toUpperCase() + u.role.slice(1)} • ${u.email}`,
                    icon: u.role === 'mentor' ? 'school' : u.role === 'admin' ? 'admin_panel_settings' : 'person',
                    category: 'Users',
                    type: 'user',
                    path: user?.role === 'admin' ? '/admin/users' : '/mentor/mentees',
                    color: u.role === 'mentor' ? 'var(--primary)' : u.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                });
            });
        }

        // Search sessions
        const filteredSessions = sessions.filter(s =>
            s.title?.toLowerCase().includes(query) ||
            s.type?.toLowerCase().includes(query)
        ).slice(0, 4);

        filteredSessions.forEach(s => {
            results.push({
                id: `session-${s.id}`,
                label: s.title || 'Untitled Session',
                sublabel: `${s.date} at ${s.time} • ${s.type || 'Meeting'}`,
                icon: 'event',
                category: 'Sessions',
                type: 'session',
                path: user?.role === 'admin' ? '/admin' : `/${user?.role}/sessions`,
                color: 'var(--accent-pink)',
            });
        });

        // Search tasks
        const filteredTasks = tasks.filter(t =>
            t.title?.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query)
        ).slice(0, 4);

        filteredTasks.forEach(t => {
            results.push({
                id: `task-${t.id}`,
                label: t.title,
                sublabel: `${t.status?.charAt(0).toUpperCase() + t.status?.slice(1)} • Due: ${t.dueDate}`,
                icon: t.status === 'completed' ? 'task_alt' : 'pending_actions',
                category: 'Tasks',
                type: 'task',
                path: `/${user?.role}/tasks`,
                color: t.status === 'completed' ? 'var(--success)' : t.status === 'overdue' ? 'var(--danger)' : 'var(--warning)',
            });
        });

        // Search quick actions
        const filteredActions = quickActions.filter(a =>
            a.label.toLowerCase().includes(query)
        );

        filteredActions.forEach(action => {
            results.push({
                ...action,
                category: 'Quick Actions',
                type: 'action',
            });
        });

        return results;
    }, [searchQuery, users, sessions, tasks, quickActions, user?.role]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < searchResults.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev > 0 ? prev - 1 : searchResults.length - 1
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (searchResults[selectedIndex]) {
                        handleSelect(searchResults[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, searchResults, selectedIndex, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        if (resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    // Handle item selection
    const handleSelect = (item) => {
        onClose();
        if (item.path) {
            navigate(item.path);
        }
    };

    // Group results by category
    const groupedResults = useMemo(() => {
        const groups = {};
        searchResults.forEach(result => {
            if (!groups[result.category]) {
                groups[result.category] = [];
            }
            groups[result.category].push(result);
        });
        return groups;
    }, [searchResults]);

    // Get flat index for keyboard navigation
    const getFlatIndex = (categoryIndex, itemIndex) => {
        let flatIndex = 0;
        const categories = Object.keys(groupedResults);
        for (let i = 0; i < categoryIndex; i++) {
            flatIndex += groupedResults[categories[i]].length;
        }
        return flatIndex + itemIndex;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="animate-fadeIn"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9998,
                }}
            />

            {/* Modal */}
            <div
                className="animate-scaleIn"
                style={{
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '560px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 9999,
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                }}
            >
                {/* Search Input */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 'var(--space-4)',
                        borderBottom: '1px solid var(--border-light)',
                        gap: 'var(--space-3)',
                    }}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ color: 'var(--primary)', fontSize: '24px' }}
                    >
                        search
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search users, sessions, tasks, or type a command..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '1rem',
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)',
                        }}
                    />
                    <kbd
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontFamily: 'inherit',
                            backgroundColor: 'var(--bg-main)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-light)',
                        }}
                    >
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div
                    ref={resultsRef}
                    style={{
                        maxHeight: '360px',
                        overflowY: 'auto',
                        padding: 'var(--space-2)',
                    }}
                >
                    {searchResults.length === 0 ? (
                        <div
                            style={{
                                padding: 'var(--space-8)',
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '48px', opacity: 0.5 }}
                            >
                                search_off
                            </span>
                            <p style={{ marginTop: 'var(--space-2)' }}>
                                No results found for "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedResults).map(([category, items], catIndex) => (
                            <div key={category} style={{ marginBottom: 'var(--space-2)' }}>
                                {/* Category Header */}
                                <div
                                    style={{
                                        padding: 'var(--space-2) var(--space-3)',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {category}
                                </div>

                                {/* Category Items */}
                                {items.map((item, itemIndex) => {
                                    const flatIndex = getFlatIndex(catIndex, itemIndex);
                                    const isSelected = flatIndex === selectedIndex;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(flatIndex)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                padding: 'var(--space-3)',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            {/* Icon */}
                                            <div
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: 'var(--radius-md)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: item.color ? `${item.color}15` : 'var(--primary-light)',
                                                    color: item.color || 'var(--primary)',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined"
                                                    style={{ fontSize: '20px' }}
                                                >
                                                    {item.icon}
                                                </span>
                                            </div>

                                            {/* Text */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontWeight: '500',
                                                        color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {item.label}
                                                </div>
                                                {item.sublabel && (
                                                    <div
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: 'var(--text-secondary)',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {item.sublabel}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Arrow indicator */}
                                            {isSelected && (
                                                <span
                                                    className="material-symbols-outlined"
                                                    style={{
                                                        fontSize: '18px',
                                                        color: 'var(--primary)',
                                                    }}
                                                >
                                                    arrow_forward
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer with keyboard hints */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-3)',
                        borderTop: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-main)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <kbd style={{ padding: '2px 6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>↑</kbd>
                        <kbd style={{ padding: '2px 6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>↓</kbd>
                        <span>Navigate</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <kbd style={{ padding: '2px 6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>↵</kbd>
                        <span>Select</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <kbd style={{ padding: '2px 6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>Esc</kbd>
                        <span>Close</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CommandPalette;
