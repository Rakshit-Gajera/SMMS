// ==============================================
// DATA CONTEXT - GLOBAL APP STATE (API-connected)
// ==============================================
// Loads real data from the backend API.
// Falls back to cached localStorage data if offline.

import { createContext, useContext, useState, useEffect } from 'react';
import {
    getStudents, createStudent, updateStudent, deleteStudent,
    getStaff, createStaff, updateStaff, deleteStaff,
    assignMentor, changeMentor,
    getSessionsByMentorIdApi, getSessionsByStudentIdApi, createSessionApi, updateSessionApi, deleteSessionApi, getMentoringSessions_All
} from '../services/api';

// ==============================================
// CREATE CONTEXT
// ==============================================
const DataContext = createContext(null);

// Storage keys (used as a cache only)
const STORAGE_KEYS = {
    SESSIONS: 'smms_sessions',
    NOTIFICATIONS: 'smms_notifications',
};

// Helper to load from localStorage
function loadFromStorage(key, defaultValue) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

const initialNotifications = [
    { id: '1', type: 'info', message: 'Welcome to SMMS! Connected to MySQL database.', priority: 'medium', timestamp: Date.now(), read: false },
];

// ==============================================
// DATA PROVIDER
// ==============================================
export function DataProvider({ children }) {

    // ---- Users (from API) ----
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);

    // ---- Tasks (local only, no backend table) ----
    const [tasks, setTasks] = useState(() => loadFromStorage('smms_tasks', []));

    // ---- Sessions / Notifications ----
    const [sessions, setSessions] = useState([]);
    const [notifications, setNotifications] = useState(() => loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications));

    // Persist tasks & notifications to localStorage
    useEffect(() => { localStorage.setItem('smms_tasks', JSON.stringify(tasks)); }, [tasks]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);

    // Task CRUD — localStorage only (no separate DB table)
    // Tasks are stored in smms_tasks key in localStorage and shared across
    // mentor/student sessions on the same browser.

    const addTask = async (taskData) => {
        console.log('[DataContext] addTask (localStorage):', taskData);
        const newTask = {
            id: Date.now().toString(),
            status: 'pending',
            assignedTo: taskData.assignedTo,
            assignedBy: taskData.assignedBy,
            ...taskData,
        };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const updateTask = (taskId, updates) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    };

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const toggleTaskComplete = (taskId) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
        ));
    };

    // Match by EnrollmentNo or assignedTo field
    const getTasksByUserId = (userId) =>
        tasks.filter(t => String(t.assignedTo) === String(userId));

    // These are no-ops — data comes from localStorage via state init
    const fetchTasksForMentor = async () => {};
    const fetchTasksForStudent = async () => {};

    // ==============================================
    // LOAD USERS FROM API on mount
    // ==============================================
    useEffect(() => {
        async function loadUsers() {
            const token = localStorage.getItem('smms_token');
            if (!token) {
                setUsersLoading(false);
                return; // Do not fetch if not logged in
            }

            console.log('[DataContext] loadUsers: Starting to fetch students and staff from API...');
            setUsersLoading(true);
            setUsersError(null);
            try {
                // Load students and staff in parallel
                const [studentsData, staffData] = await Promise.all([
                    getStudents().catch(() => []), // Ignore 403 if they don't have permission
                    getStaff().catch(() => []),
                ]);
                console.log('[DataContext] loadUsers: Received', studentsData.length, 'students and', staffData.length, 'staff from API');

                // Normalize students
                const students = studentsData.map(s => {
                    const assignedStaff = staffData.find(st => st.StaffID === s.mentorId);
                    return {
                        id: s.EnrollmentNo,
                        name: s.StudentName,
                        email: s.EmailAddress,
                        role: 'student',
                        department: s.Description || 'Student',
                        status: 'active',
                        menteeCount: 0,
                        mentorId: s.mentorId || null,
                        mentorName: assignedStaff ? assignedStaff.StaffName : null,
                        // Keep original fields too
                        ...s,
                    };
                });

                // Normalize staff - determine role by email
                const adminEmail = 'admin@darshan.ac.in';
                const staff = staffData.map(s => {
                    const mentees = studentsData.filter(st => st.mentorId === s.StaffID);
                    return {
                        id: s.StaffID,
                        name: s.StaffName,
                        email: s.EmailAddress,
                        role: s.EmailAddress === adminEmail ? 'admin' : 'mentor',
                        department: s.Description || 'Staff',
                        status: 'active',
                        menteeCount: mentees.length, // Set actual mentee count from DB
                        mentorId: null,
                        // Keep original fields too
                        ...s,
                    };
                });

                console.log('[DataContext] loadUsers: Setting', staff.length + students.length, 'total users in state');
                setUsers([...staff, ...students]);
            } catch (err) {
                console.error('[DataContext] loadUsers FAILED:', err.message, err);
                setUsersError(err.message);
            } finally {
                setUsersLoading(false);
            }
        }
        loadUsers();
    }, []);

    // ==============================================
    // USER CRUD (wired to API)
    // ==============================================

    /** Add a new user (staff or student) */
    const addUser = async (userData) => {
        console.log('[DataContext] addUser called with:', userData);
        try {
            if (userData.role === 'student') {
                const payload = {
                    StudentName: userData.name,
                    EnrollmentNo: userData.EnrollmentNo || userData.id,
                    Password: userData.password || 'student123',
                    MobileNo: userData.MobileNo || '',
                    EmailAddress: userData.email,
                    Description: userData.department || '',
                };
                console.log('[DataContext] addUser → createStudent payload:', payload);
                const result = await createStudent(payload);
                console.log('[DataContext] createStudent API result:', result);
                const newUser = { id: payload.EnrollmentNo, ...userData, EnrollmentNo: payload.EnrollmentNo };
                setUsers(prev => [...prev, newUser]);
                return newUser;
            } else {
                // staff / mentor
                const payload = {
                    StaffID: userData.StaffID || userData.id,
                    StaffName: userData.name,
                    MobileNo: userData.MobileNo || '',
                    EmailAddress: userData.email,
                    Password: userData.password || 'mentor123',
                    Description: userData.department || '',
                };
                console.log('[DataContext] addUser → createStaff payload:', payload);
                const result = await createStaff(payload);
                console.log('[DataContext] createStaff API result:', result);
                const newUser = { id: payload.StaffID, ...userData, StaffID: payload.StaffID };
                setUsers(prev => [...prev, newUser]);
                return newUser;
            }
        } catch (err) {
            console.error('[DataContext] addUser FAILED:', err.message, err);
            throw err;
        }
    };

    /** Update a user */
    const updateUser = async (userId, updates) => {
        console.log('[DataContext] updateUser called for:', userId, 'with updates:', updates);
        // Optimistic UI update
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
        try {
            const user = users.find(u => u.id === userId);
            if (user?.role === 'student') {
                // Map frontend field names → backend field names
                const payload = {};
                if (updates.name       !== undefined) payload.StudentName   = updates.name;
                if (updates.email      !== undefined) payload.EmailAddress  = updates.email;
                if (updates.password   !== undefined && updates.password !== '') payload.Password = updates.password;
                if (updates.department !== undefined) payload.Description   = updates.department;
                if (updates.MobileNo   !== undefined) payload.MobileNo      = updates.MobileNo;
                console.log('[DataContext] updateStudent payload:', payload);
                await updateStudent(userId, payload);
                console.log('[DataContext] updateStudent success');
            } else if (user?.role === 'mentor' || user?.role === 'admin') {
                const payload = {};
                if (updates.name       !== undefined) payload.StaffName     = updates.name;
                if (updates.email      !== undefined) payload.EmailAddress  = updates.email;
                if (updates.password   !== undefined && updates.password !== '') payload.Password = updates.password;
                if (updates.department !== undefined) payload.Description   = updates.department;
                if (updates.MobileNo   !== undefined) payload.MobileNo      = updates.MobileNo;
                console.log('[DataContext] updateStaff payload:', payload);
                await updateStaff(userId, payload);
                console.log('[DataContext] updateStaff success');
            }
        } catch (err) {
            console.error('[DataContext] updateUser API error:', err.message);
            throw err;
        }
    };

    /** Delete a user */
    const deleteUser = async (userId) => {
        const user = users.find(u => u.id === userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
        try {
            if (user?.role === 'student') {
                await deleteStudent(userId);
            } else {
                await deleteStaff(userId);
            }
        } catch (err) {
            console.error('deleteUser API error:', err);
        }
    };

    // Helper getters
    const getUsersByRole = (role) => users.filter(u => u.role === role);
    const getMentors = () => getUsersByRole('mentor');
    const getStudentsList = () => getUsersByRole('student');
    const getMenteesByMentorId = (mentorId) => users.filter(u => u.mentorId === mentorId);

    // ==============================================
    // SESSION CRUD (MySQL Backend Integration)
    // ==============================================

    const parseDesc = (desc) => {
        try { if (desc && desc.startsWith('{')) return JSON.parse(desc); } catch(e) {}
        return { time: '10:00', duration: 30, location: 'Office' };
    };

    const fetchSessionsForMentor = async (staffId) => {
        console.log(`[DataContext] fetchSessionsForMentor: staffId=${staffId}`);
        try {
            const result = await getSessionsByMentorIdApi(staffId);
            const data = Array.isArray(result) ? result : (result.data || []);
            console.log(`[DataContext] fetchSessionsForMentor: raw API returned ${data.length} record(s)`, data);
            const formatted = data.map(s => {
                const extras = parseDesc(s.Description);
                const sessionDate = new Date(s.ScheduledMeetingDate || s.DateOfMentoring);
                let status;
                if (s.AttendanceStatus) {
                    status = 'completed';
                } else if (sessionDate < new Date()) {
                    status = 'pending';
                } else {
                    status = 'scheduled';
                }
                return {
                    id: s.StudentMentoringID,
                    title: s.MentoringMeetingAgenda || 'Mentoring Session',
                    mentorId: staffId,
                    studentId: s.StudentID,          // numeric DB id
                    enrollmentNo: s.EnrollmentNo,    // string e.g. "24010101071" — used for student matching
                    studentName: s.StudentName,
                    date: s.ScheduledMeetingDate
                        ? s.ScheduledMeetingDate.split('T')[0]
                        : (s.DateOfMentoring ? s.DateOfMentoring.split('T')[0] : ''),
                    dateOfMentoring: s.DateOfMentoring ? s.DateOfMentoring.split('T')[0] : '',
                    time: extras.time || '10:00',
                    duration: extras.duration || 30,
                    location: extras.location || 'Office',
                    notes: s.IssuesDiscussed || '',
                    status,
                    // Keep all raw DB fields too
                    ...s,
                };
            });
            console.log(`[DataContext] fetchSessionsForMentor: formatted ${formatted.length} sessions, setting state`);
            setSessions(formatted);
        } catch (err) {
            console.error('[DataContext] fetchSessionsForMentor error:', err);
        }
    };

    const fetchSessionsForStudent = async (enrollmentNo) => {
        console.log(`[DataContext] fetchSessionsForStudent: enrollmentNo=${enrollmentNo}`);
        if (!enrollmentNo) return;
        try {
            const result = await getSessionsByStudentIdApi(enrollmentNo);
            const data = Array.isArray(result) ? result : (result.data || []);
            console.log(`[DataContext] fetchSessionsForStudent: raw API returned ${data.length} record(s)`, data);
            const formatted = data.map(s => {
                const extras = parseDesc(s.Description);
                const sessionDate = new Date(s.ScheduledMeetingDate || s.DateOfMentoring);
                let status;
                if (s.AttendanceStatus) {
                    status = 'completed';
                } else if (sessionDate < new Date()) {
                    status = 'pending';
                } else {
                    status = 'scheduled';
                }
                return {
                    id: s.StudentMentoringID,
                    title: s.MentoringMeetingAgenda || 'Mentoring Session',
                    mentorId: s.StaffID,
                    mentorName: s.StaffName || '',
                    studentId: null,
                    enrollmentNo: enrollmentNo,  // for student-side matching
                    date: s.ScheduledMeetingDate
                        ? s.ScheduledMeetingDate.split('T')[0]
                        : (s.DateOfMentoring ? s.DateOfMentoring.split('T')[0] : ''),
                    dateOfMentoring: s.DateOfMentoring ? s.DateOfMentoring.split('T')[0] : '',
                    time: extras.time || '10:00',
                    duration: extras.duration || 30,
                    location: extras.location || 'Office',
                    notes: s.IssuesDiscussed || '',
                    status,
                    // Keep all raw DB fields
                    ...s,
                };
            });
            console.log(`[DataContext] fetchSessionsForStudent: formatted ${formatted.length} sessions, merging into state`);
            // Merge: keep mentor sessions, replace/add student sessions
            setSessions(prev => {
                const mentorSessions = prev.filter(s => s.enrollmentNo !== enrollmentNo);
                return [...mentorSessions, ...formatted];
            });
        } catch (err) {
            console.error('[DataContext] fetchSessionsForStudent error:', err);
        }
    };


    const addSession = async (sessionData) => {
        try {
            const student = users.find(u => u.id === sessionData.studentId);
            const enrollmentNo = student?.EnrollmentNo || sessionData.studentId;
            const staffId = sessionData.mentorId;
            
            const payload = {
                DateOfMentoring: sessionData.date,
                ScheduledMeetingDate: sessionData.date,
                MentoringMeetingAgenda: sessionData.title,
                IssuesDiscussed: sessionData.notes,
                Description: JSON.stringify({
                    time: sessionData.time,
                    duration: sessionData.duration,
                    location: sessionData.location
                })
            };
            
            const result = await createSessionApi(staffId, enrollmentNo, payload);
            
            const newSession = { 
                id: result.StudentMentoringID, 
                ...sessionData 
            };
            setSessions(prev => [newSession, ...prev]);
            return newSession;
        } catch(err) {
            console.error('addSession API error', err);
            throw err;
        }
    };

    const updateSession = async (sessionId, updates) => {
        // Optimistic UI
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
        try {
            const session = sessions.find(s => s.id === sessionId) || updates;
            const payload = {};
            if (updates.date) {
                payload.DateOfMentoring = updates.date;
                payload.ScheduledMeetingDate = updates.date;
            }
            if (updates.title) payload.MentoringMeetingAgenda = updates.title;
            if (updates.notes) payload.IssuesDiscussed = updates.notes;
            if (updates.status === 'completed') payload.AttendanceStatus = 'Present';
            
            const extras = parseDesc(session.Description);
            if (updates.time) extras.time = updates.time;
            if (updates.duration) extras.duration = updates.duration;
            if (updates.location) extras.location = updates.location;
            payload.Description = JSON.stringify(extras);

            await updateSessionApi(sessionId, payload);
        } catch(err) {
            console.error('updateSession API error', err);
        }
    };

    const deleteSession = async (sessionId) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        try {
            await deleteSessionApi(sessionId);
        } catch(err) {
            console.error('deleteSession API error', err);
        }
    };

    const getSessionsByMentorId = (mentorId) => {
        // We trigger API fetch once if it's empty, but return state immediately
        // Component should call fetchSessionsForMentor explicitly if needed
        return sessions.filter(s => String(s.mentorId) === String(mentorId));
    };
    
    // Match by enrollmentNo (string) since student user.id = EnrollmentNo
    const getSessionsByStudentId = (enrollmentNo) => {
        const found = sessions.filter(s => String(s.enrollmentNo) === String(enrollmentNo));
        console.log(`[DataContext] getSessionsByStudentId(${enrollmentNo}): found ${found.length} sessions from ${sessions.length} total`);
        return found;
    };


    // ==============================================
    // NOTIFICATION OPERATIONS
    // ==============================================
    const addNotification = (notifData) => {
        const newNotif = { id: Date.now().toString(), timestamp: Date.now(), read: false, ...notifData };
        setNotifications(prev => [newNotif, ...prev]);
        return newNotif;
    };
    const markNotificationRead = (notifId) => {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    };
    const clearAllNotifications = () => setNotifications([]);
    const getUnreadCount = () => notifications.filter(n => !n.read).length;

    // ==============================================
    // MENTOR-MENTEE MAPPING (wired to API)
    // ==============================================
    const assignMentorToStudent = async (studentId, mentorId) => {
        const mentor = users.find(u => u.id === mentorId);
        const student = users.find(u => u.id === studentId);
        if (!mentor || !student) return;

        const oldMentorId = student.mentorId;

        // Optimistic UI
        setUsers(prev => prev.map(u => {
            if (u.id === studentId) return { ...u, mentorId: mentor.id, mentorName: mentor.name };
            if (u.id === mentorId) return { ...u, menteeCount: (u.menteeCount || 0) + 1 };
            if (oldMentorId && u.id === oldMentorId) return { ...u, menteeCount: Math.max(0, (u.menteeCount || 1) - 1) };
            return u;
        }));

        // Sync to API
        try {
            if (student.StudentID) {
                if (oldMentorId) {
                    await changeMentor({
                        StudentID: student.StudentID,
                        NewStaffID: mentorId,
                        FromDate: new Date().toISOString().split('T')[0],
                    });
                } else {
                    await assignMentor({
                        StudentID: student.StudentID,
                        StaffID: mentorId,
                        FromDate: new Date().toISOString().split('T')[0],
                    });
                }
            } else {
                alert(`Error: Student ${student.name} does not have a database StudentID in React state. Please recreate the student or check the database.`);
                console.warn('Student does not have an integer StudentID, backend assignment failed.');
            }
        } catch (err) {
            alert(`Error from Server when assigning mentor: ${err.message}`);
            console.error('assignMentorToStudent API error:', err);
        }
    };

    const unassignMentorFromStudent = async (studentId) => {
        const student = users.find(u => u.id === studentId);
        if (student && student.mentorId) {
            const mentorId = student.mentorId;
            setUsers(prev => prev.map(u => {
                if (u.id === studentId) return { ...u, mentorId: null, mentorName: null };
                if (u.id === mentorId) return { ...u, menteeCount: Math.max(0, (u.menteeCount || 1) - 1) };
                return u;
            }));
            
            // Note: Currently no backend endpoint exists for entirely removing an assignment
            console.warn('Frontend unassigned mentor optimistically, but backend unassign endpoint is missing!');
        }
    };

    // ==============================================
    // RELOAD (refresh data from API)
    // ==============================================
    const reloadUsers = async () => {
        try {
            const [studentsData, staffData] = await Promise.all([getStudents(), getStaff()]);
            const adminEmail = 'admin@darshan.ac.in';
            const students = studentsData.map(s => {
                const assignedStaff = staffData.find(st => st.StaffID === s.mentorId);
                return {
                    id: s.EnrollmentNo,
                    name: s.StudentName,
                    email: s.EmailAddress,
                    role: 'student',
                    department: s.Description || 'Student',
                    status: 'active',
                    menteeCount: 0,
                    mentorId: s.mentorId || null,
                    mentorName: assignedStaff ? assignedStaff.StaffName : null,
                    ...s,
                };
            });
            const staff = staffData.map(s => {
                const mentees = studentsData.filter(st => st.mentorId === s.StaffID);
                return {
                    id: s.StaffID,
                    name: s.StaffName,
                    email: s.EmailAddress,
                    role: s.EmailAddress === adminEmail ? 'admin' : 'mentor',
                    department: s.Description || 'Staff',
                    status: 'active',
                    menteeCount: mentees.length, // Set actual mentee count from DB
                    mentorId: null,
                    ...s,
                };
            });
            setUsers([...staff, ...students]);
        } catch (err) {
            console.error('reloadUsers error:', err);
        }
    };

    // ==============================================
    // PROVIDE CONTEXT
    // ==============================================
    return (
        <DataContext.Provider value={{
            // Data
            users,
            tasks,
            sessions,
            notifications,
            usersLoading,
            usersError,
            // User operations
            addUser,
            updateUser,
            deleteUser,
            getUsersByRole,
            getMentors,
            getStudents: getStudentsList,
            getMenteesByMentorId,
            reloadUsers,
            // Task operations
            addTask,
            updateTask,
            deleteTask,
            toggleTaskComplete,
            getTasksByUserId,
            fetchTasksForMentor,
            fetchTasksForStudent,
            // Session operations
            addSession,
            updateSession,
            deleteSession,
            getSessionsByMentorId,
            getSessionsByStudentId,
            fetchSessionsForMentor,
            fetchSessionsForStudent,
            // Notification operations
            addNotification,
            markNotificationRead,
            clearAllNotifications,
            getUnreadCount,
            // Mentor-mentee mapping
            assignMentorToStudent,
            unassignMentorFromStudent,
        }}>
            {children}
        </DataContext.Provider>
    );
}

// ==============================================
// useData HOOK
// ==============================================
export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
