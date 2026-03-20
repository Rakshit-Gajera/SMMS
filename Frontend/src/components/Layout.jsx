// ==============================================
// LAYOUT COMPONENT - MAIN PAGE STRUCTURE
// ==============================================
// This component creates the overall page layout with:
//   - Sidebar on the left
//   - Main content area on the right (with Header on top)
//
// The Outlet component is where the actual page content appears
// (Dashboard, User Management, etc.)

// Import Outlet - this is where child routes render their content
import { Outlet, Navigate } from 'react-router-dom';

// Import our sidebar and header components
import Sidebar from './Sidebar';
import Header from './Header';

// Import auth hook to check if user is logged in
import { useAuth } from '../context/AuthContext';

// ==============================================
// LAYOUT COMPONENT
// ==============================================
// Props:
//   - role: the role this layout is for (admin, mentor, student)
//           Used to show the correct sidebar menu

function Layout({ role }) {
    // Get authentication status
    const { isAuthenticated, user } = useAuth();

    // ==============================================
    // AUTHENTICATION CHECK
    // ==============================================
    // If user is not logged in, redirect them to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ==============================================
    // ROLE CHECK (Optional - Extra Security)
    // ==============================================
    // Make sure the user has permission to view this section
    // For example, a student shouldn't access /admin routes
    if (user.role !== role) {
        // Redirect to their correct dashboard
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return (
        // Main container - takes full screen, uses flexbox for layout
        <div className="app-container">

            {/* ==============================================
          SIDEBAR - Left side navigation
          ============================================== */}
            <Sidebar role={role} />

            {/* ==============================================
          MAIN CONTENT AREA - Right side
          ============================================== */}
            <main className="main-content">
                {/* Header at the top */}
                <Header />

                {/* Page content area */}
                {/* Outlet renders the current page component based on the route */}
                {/* For example: if URL is /admin/dashboard, it renders AdminDashboard */}
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

// Export the component
export default Layout;
