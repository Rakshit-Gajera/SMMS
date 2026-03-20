// ==============================================
// SMMS FULL BACKEND ENDPOINT TEST SCRIPT
// Run with: node test_endpoints.js
// ==============================================

const http = require('http');

const BASE = 'http://localhost:3000';

// ANSI colors
const GREEN  = '\x1b[32m✅\x1b[0m';
const RED    = '\x1b[31m❌\x1b[0m';
const YELLOW = '\x1b[33m⚠️ \x1b[0m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';

let adminToken   = '';
let mentorToken  = '';
let studentToken = '';
let results      = [];

function req(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const postData = body ? JSON.stringify(body) : '';
        const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const options = {
            hostname: 'localhost', port: 3000,
            path, method,
            headers,
        };

        const r = http.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        r.on('error', reject);
        if (postData) r.write(postData);
        r.end();
    });
}

function log(name, status, response, expectOk = true) {
    const ok  = expectOk ? status >= 200 && status < 300 : true;
    const icon = ok ? GREEN : (status === 403 || status === 401) ? YELLOW : RED;
    const label = `${icon} [${status}] ${name}`;
    console.log(label);
    if (!ok && typeof response === 'object') {
        console.log(`   → ${response?.message || JSON.stringify(response).substring(0, 100)}`);
    } else if (ok && typeof response === 'object') {
        const preview = Array.isArray(response)
            ? `Array[${response.length}]`
            : JSON.stringify(response).substring(0, 120);
        console.log(`   → ${preview}`);
    }
    results.push({ name, status, ok });
}

async function runTests() {
    console.log(`\n${CYAN}╔══════════════════════════════════════════╗`);
    console.log(`║   SMMS BACKEND FULL ENDPOINT TEST SUITE  ║`);
    console.log(`╚══════════════════════════════════════════╝${RESET}\n`);

    // ── 1. HEALTH CHECK ────────────────────────────────────
    console.log(`${CYAN}── HEALTH CHECK ────────────────────────────${RESET}`);
    try {
        const r = await req('GET', '/', null, null);
        log('GET / (Health Check)', r.status, r.body);
    } catch (e) { console.log(`${RED} GET / FAILED — is the server running? ${e.message}`); process.exit(1); }

    // ── 2. AUTH: LOGIN FOR ALL 3 ROLES ─────────────────────
    console.log(`\n${CYAN}── AUTH ROUTES ─────────────────────────────${RESET}`);

    const adminLogin = await req('POST', '/api/auth/login', { email: 'admin@darshan.ac.in', password: 'admin123', role: 'admin' });
    log('POST /api/auth/login (Admin)', adminLogin.status, adminLogin.body);
    adminToken = adminLogin.body?.token || '';

    const mentorLogin = await req('POST', '/api/auth/login', { email: 'arjun@darshan.ac.in', password: 'mentor123', role: 'mentor' });
    log('POST /api/auth/login (Mentor)', mentorLogin.status, mentorLogin.body);
    mentorToken = mentorLogin.body?.token || '';

    const stuLogin = await req('POST', '/api/auth/login', { email: 'soham@darshan.ac.in', password: 'student123', role: 'student' });
    log('POST /api/auth/login (Student)', stuLogin.status, stuLogin.body);
    studentToken = stuLogin.body?.token || '';

    const wrongLogin = await req('POST', '/api/auth/login', { email: 'fake@email.com', password: 'wrong', role: 'student' });
    log('POST /api/auth/login (Wrong Creds should be 401/400)', wrongLogin.status, wrongLogin.body, false);

    // ── 3. STUDENT ROUTES ──────────────────────────────────
    console.log(`\n${CYAN}── STUDENT ROUTES (/api/students) ──────────${RESET}`);

    const allStudents = await req('GET', '/api/students', null, adminToken);
    log('GET /api/students (Admin)', allStudents.status, allStudents.body);

    const noTokenStudents = await req('GET', '/api/students', null, null);
    log('GET /api/students (No Token → should be 401)', noTokenStudents.status, noTokenStudents.body, false);

    const oneStudent = await req('GET', '/api/students/22CS001', null, adminToken);
    log('GET /api/students/22CS001 (Admin)', oneStudent.status, oneStudent.body);

    const mentoringHistory = await req('GET', '/api/students/22CS001/mentoring-history', null, studentToken);
    log('GET /api/students/22CS001/mentoring-history (Student)', mentoringHistory.status, mentoringHistory.body);

    const mentorDetail = await req('GET', '/api/students/22CS001/mentorDetail', null, studentToken);
    log('GET /api/students/22CS001/mentorDetail (Student)', mentorDetail.status, mentorDetail.body);

    // ── 4. STAFF ROUTES ────────────────────────────────────
    console.log(`\n${CYAN}── STAFF ROUTES (/api/staff) ───────────────${RESET}`);

    const allStaff = await req('GET', '/api/staff', null, adminToken);
    log('GET /api/staff (Admin)', allStaff.status, allStaff.body);

    const oneStaff = await req('GET', '/api/staff/STAFF001', null, adminToken);
    log('GET /api/staff/STAFF001 (Admin)', oneStaff.status, oneStaff.body);

    const mentees = await req('GET', '/api/staff/STAFF001/mentees', null, mentorToken);
    log('GET /api/staff/STAFF001/mentees (Mentor)', mentees.status, mentees.body);

    const mentorSessions = await req('GET', '/api/staff/STAFF001/mentoring-sessions?enrollmentNo=22CS001', null, mentorToken);
    log('GET /api/staff/STAFF001/mentoring-sessions (Mentor)', mentorSessions.status, mentorSessions.body);

    // ── 5. STUDENTMENTOR ROUTES ────────────────────────────
    console.log(`\n${CYAN}── STUDENT-MENTOR ROUTES (/api/studentmentor) ─${RESET}`);

    const currentMentor = await req('GET', '/api/studentmentor/current/22CS001', null, studentToken);
    log('GET /api/studentmentor/current/22CS001 (Student)', currentMentor.status, currentMentor.body);

    const mentorStudents = await req('GET', '/api/studentmentor/mentor/STAFF001', null, mentorToken);
    log('GET /api/studentmentor/mentor/STAFF001 (Mentor Sessions)', mentorStudents.status, mentorStudents.body);

    // ── 6. STUDENTMENTORING ROUTES ────────────────────────
    console.log(`\n${CYAN}── MENTORING SESSION ROUTES (/api/studentmentoring) ─${RESET}`);

    const globalSessions = await req('GET', '/api/studentmentoring/global/history', null, adminToken);
    log('GET /api/studentmentoring/global/history (Admin)', globalSessions.status, globalSessions.body);

    const studentHistory = await req('GET', '/api/studentmentoring/student/1', null, studentToken);
    log('GET /api/studentmentoring/student/1 (by StudentID)', studentHistory.status, studentHistory.body);

    const mentorSess = await req('GET', '/api/studentmentoring/mentor/STAFF001', null, mentorToken);
    log('GET /api/studentmentoring/mentor/STAFF001 (Mentor All Sessions)', mentorSess.status, mentorSess.body);

    const reports = await req('GET', '/api/studentmentoring/reports/mentor-wise-mentees', null, adminToken);
    log('GET /api/studentmentoring/reports/mentor-wise-mentees (Admin)', reports.status, reports.body);

    // ── 7. ROLE ENFORCEMENT TESTS ─────────────────────────
    console.log(`\n${CYAN}── ROLE ENFORCEMENT (should all be 403) ────${RESET}`);

    const stuAccessAdmin  = await req('GET', '/api/students', null, studentToken);
    log('GET /api/students with Student Token (expect 403)', stuAccessAdmin.status, stuAccessAdmin.body, false);

    const mentorAccessAdmin = await req('GET', '/api/staff', null, mentorToken);
    log('GET /api/staff with Mentor Token (expect 403)', mentorAccessAdmin.status, mentorAccessAdmin.body, false);

    // ── SUMMARY ───────────────────────────────────────────
    const passed = results.filter(r => r.ok).length;
    const total  = results.length;
    console.log(`\n${CYAN}╔══════════════════════════════════════════╗`);
    console.log(`║  RESULTS: ${passed}/${total} endpoints behaved as expected  `);
    console.log(`╚══════════════════════════════════════════╝${RESET}\n`);

    const failed = results.filter(r => !r.ok);
    if (failed.length > 0) {
        console.log(`${RED} FAILED ENDPOINTS:`);
        failed.forEach(f => console.log(`   - [${f.status}] ${f.name}`));
    } else {
        console.log(`${GREEN} All endpoints passed!`);
    }
}

runTests().catch(err => {
    console.error('\n❌ Test runner crashed:', err.message);
});
