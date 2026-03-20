// ==============================================
// API SERVICE - Central place for all backend calls
// ==============================================
// All requests go to /api (Vite proxy forwards to http://localhost:3000)
// Token is automatically read from localStorage and attached to requests

const BASE_URL = '/api';
const TOKEN_KEY = 'smms_token';

// --------------------------------------------------
// Helpers
// --------------------------------------------------

/** Save JWT token */
export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/** Get JWT token */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/** Remove JWT token (on logout) */
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Makes an authenticated fetch request.
 * Automatically attaches the JWT token as a Bearer header.
 */
async function authFetch(path, options = {}) {
    const token = getToken();
    const method = options.method || 'GET';
    console.log(`[API] ${method} ${BASE_URL}${path}`, options.body ? JSON.parse(options.body) : '');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMsg = `Request failed (${response.status})`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (_) {}
        console.error(`[API] FAILED ${method} ${BASE_URL}${path} →`, response.status, errorMsg);
        throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log(`[API] OK ${method} ${BASE_URL}${path} →`, data);
    return data;
}

// --------------------------------------------------
// AUTH
// --------------------------------------------------

/**
 * Login a user.
 * @param {string} email
 * @param {string} password
 * @param {string} role - 'admin' | 'mentor' | 'student'
 * @returns {{ token: string, user: object }}
 */
export async function loginUser(email, password, role) {
    const data = await authFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
    });
    // Persist token
    if (data.token) saveToken(data.token);
    return data;
}

// --------------------------------------------------
// STUDENTS
// --------------------------------------------------

/** Get all students */
export async function getStudents() {
    return authFetch('/students');
}

/** Get a single student by EnrollmentNo */
export async function getStudentById(enrollmentNo) {
    return authFetch(`/students/${enrollmentNo}`);
}

/** Create a new student */
export async function createStudent(studentData) {
    return authFetch('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
    });
}

/** Update a student */
export async function updateStudent(enrollmentNo, updates) {
    return authFetch(`/students/${enrollmentNo}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}

/** Delete a student */
export async function deleteStudent(enrollmentNo) {
    return authFetch(`/students/${enrollmentNo}`, { method: 'DELETE' });
}

/** Get full mentor info for a student */
export async function getStudentMentor(enrollmentNo) {
    return authFetch(`/students/${enrollmentNo}/mentorDetail`);
}

/** Get full mentoring history for a student */
export async function getStudentMentoringHistory(enrollmentNo) {
    return authFetch(`/students/${enrollmentNo}/mentoring-history`);
}

// --------------------------------------------------
// STAFF / MENTORS
// --------------------------------------------------

/** Get all staff */
export async function getStaff() {
    return authFetch('/staff');
}

/** Get a single staff member by StaffID */
export async function getStaffById(staffId) {
    return authFetch(`/staff/${staffId}`);
}

/** Create a new staff member */
export async function createStaff(staffData) {
    return authFetch('/staff', {
        method: 'POST',
        body: JSON.stringify(staffData),
    });
}

/** Update a staff member */
export async function updateStaff(staffId, updates) {
    return authFetch(`/staff/${staffId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}

/** Delete a staff member */
export async function deleteStaff(staffId) {
    return authFetch(`/staff/${staffId}`, { method: 'DELETE' });
}

/** Get all current mentees for a mentor */
export async function getMenteesForMentor(staffId) {
    return authFetch(`/staff/${staffId}/mentees`);
}

/** Get mentoring sessions for a specific mentor */
export async function getMentoringSessions(staffId) {
    return authFetch(`/studentmentor/mentor/${staffId}`);
}

// --------------------------------------------------
// STUDENT-MENTOR MAPPING
// --------------------------------------------------

/** Assign a mentor to a student */
export async function assignMentor(data) {
    return authFetch('/studentmentor/mentor/assign', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/** Change a student's mentor */
export async function changeMentor(data) {
    return authFetch('/studentmentor/mentor/change', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

/** Get current mentor for a student */
export async function getCurrentMentor(enrollmentNo) {
    return authFetch(`/studentmentor/current/${enrollmentNo}`);
}

// --------------------------------------------------
// MENTORING SESSIONS
// --------------------------------------------------

/** Get all mentoring sessions */
export async function getMentoringSessions_All() {
    return authFetch('/studentmentoring/reports/mentoring-history');
}

/** Get sessions for a Mentor */
export async function getSessionsByMentorIdApi(staffId) {
    return authFetch(`/studentmentoring/mentor/${staffId}`);
}

/** Get sessions for a Student */
export async function getSessionsByStudentIdApi(studentId) {
    return authFetch(`/studentmentoring/student/${studentId}`);
}

/** Create a new mentoring session */
export async function createSessionApi(staffId, enrollmentNo, sessionData) {
    return authFetch(`/studentmentoring/session/${staffId}/${enrollmentNo}`, {
        method: 'POST',
        body: JSON.stringify(sessionData),
    });
}

/** Update a mentoring session */
export async function updateSessionApi(sessionId, updates) {
    return authFetch(`/studentmentoring/session/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}

/** Delete a mentoring session */
export async function deleteSessionApi(sessionId) {
    return authFetch(`/studentmentoring/session/${sessionId}`, { method: 'DELETE' });
}
