// ==============================================
// APP.JSX - THE MAIN APPLICATION COMPONENT
// ==============================================
// This is the "root" component of our app. It:
//   1. Sets up the authentication provider
//   2. Sets up the data provider for shared state
//   3. Defines all the routes (pages) in our app
//   4. Controls which layout to show based on user role

// Import routing components from react-router-dom
import { Routes, Route, Navigate } from 'react-router-dom';

// Import our Providers to wrap the app
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Import the main Layout component
import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';
import MentorLayout from './components/MentorLayout';
import AdminLayout from './components/AdminLayout';

// Import all page components
// LOGIN
import Login from './pages/Login';

// ADMIN PAGES
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminReports from './pages/admin/AdminReports';

// MENTOR PAGES
import MentorDashboard from './pages/mentor/MentorDashboard';
import MenteeList from './pages/mentor/MenteeList';
import SessionManagement from './pages/mentor/SessionManagement';
import FeedbackRemarks from './pages/mentor/FeedbackRemarks';

// STUDENT PAGES
import StudentDashboard from './pages/student/StudentDashboard';
import MentorInfo from './pages/student/MentorInfo';
import StudentSessions from './pages/student/StudentSessions';
import StudentReports from './pages/student/StudentReports';

// ==============================================
// MAIN APP COMPONENT
// ==============================================
function App() {
    return (
        // DataProvider wraps everything for shared data access
        <DataProvider>
            {/* AuthProvider wraps everything so all components can access auth data */}
            <AuthProvider>
                {/* Routes defines all the different "pages" in our app */}
                <Routes>

                    {/* ==============================================
            PUBLIC ROUTES (No login required)
            ============================================== */}

                    {/* The main "/" path redirects to login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Login page - anyone can access this */}
                    <Route path="/login" element={<Login />} />

                    {/* ==============================================
            ADMIN ROUTES
            Path: /admin/...
            ============================================== */}
                    {/* All admin pages use the AdminLayout (top navbar, no sidebar) */}
                    <Route path="/admin" element={<AdminLayout />}>
                        {/* /admin redirects to /admin/dashboard */}
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />

                        {/* /admin/dashboard - Admin's main dashboard */}
                        <Route path="dashboard" element={<AdminDashboard />} />

                        {/* /admin/users - User management page */}
                        <Route path="users" element={<UserManagement />} />

                        {/* /admin/reports - Reports and analytics */}
                        <Route path="reports" element={<AdminReports />} />
                    </Route>

                    {/* ==============================================
            MENTOR ROUTES
            Path: /mentor/...
            ============================================== */}
                    {/* All mentor pages use the MentorLayout (top navbar, no sidebar) */}
                    <Route path="/mentor" element={<MentorLayout />}>
                        {/* /mentor redirects to /mentor/dashboard */}
                        <Route index element={<Navigate to="/mentor/dashboard" replace />} />

                        {/* /mentor/dashboard - Mentor's main dashboard */}
                        <Route path="dashboard" element={<MentorDashboard />} />

                        {/* /mentor/mentees - List of assigned mentees */}
                        <Route path="mentees" element={<MenteeList />} />

                        {/* /mentor/sessions - Manage mentoring sessions */}
                        <Route path="sessions" element={<SessionManagement />} />

                        {/* /mentor/feedback - Feedback and remarks */}
                        <Route path="feedback" element={<FeedbackRemarks />} />
                    </Route>

                    {/* ==============================================
            STUDENT ROUTES
            Path: /student/...
            ============================================== */}
                    {/* All student pages use the StudentLayout (top navbar, no sidebar) */}
                    <Route path="/student" element={<StudentLayout />}>
                        {/* /student redirects to /student/dashboard */}
                        <Route index element={<Navigate to="/student/dashboard" replace />} />

                        {/* /student/dashboard - Student's main dashboard */}
                        <Route path="dashboard" element={<StudentDashboard />} />

                        {/* /student/mentor - View mentor information */}
                        <Route path="mentor" element={<MentorInfo />} />

                        {/* /student/sessions - View past and upcoming sessions */}
                        <Route path="sessions" element={<StudentSessions />} />

                        {/* /student/reports - Personal progress reports */}
                        <Route path="reports" element={<StudentReports />} />
                    </Route>

                </Routes>
            </AuthProvider>
        </DataProvider>
    );
}

// Export the App component so main.jsx can use it
export default App;
