// ==============================================
// AUTH CONTEXT - MANAGES USER LOGIN STATE
// ==============================================
// This file creates a "Context" which is like a global storage
// that any component in our app can access.
// We use it to store:
//   - Who is currently logged in
//   - What role they have (Admin, Mentor, Student)
//   - Functions to login and logout
// NOW WITH: localStorage persistence so refresh doesn't log out!

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../services/api';

// ==============================================
// CREATE THE CONTEXT
// ==============================================
const AuthContext = createContext(null);

// Storage key for localStorage
const STORAGE_KEY = 'smms_user';

// ==============================================
// AUTH PROVIDER COMPONENT
// ==============================================
export function AuthProvider({ children }) {
    // ==============================================
    // STATE - Initialize from localStorage if available
    // ==============================================
    const [user, setUser] = useState(() => {
        // Try to get saved user from localStorage on initial load
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                console.error('Error parsing saved user:', e);
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
        }
        return null;
    });

    const [isLoading, setIsLoading] = useState(true);

    // Check if user session is valid on mount
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    // ==============================================
    // MOCK USERS DATABASE
    // ==============================================
    const mockUsers = {
        admin: {
            id: '1',
            name: 'Rakshit Gajera',
            email: 'rakshitgajera@darshan.ac.in',
            role: 'admin',
            avatar: null,
            department: 'Administration'
        },
        mentor: {
            id: '2',
            name: 'Arjun Bala',
            email: 'arjunbala@darshan.ac.in',
            role: 'mentor',
            avatar: null,
            department: 'Computer Science',
            menteeCount: 12
        },
        student: {
            id: '3',
            name: 'Manas Borisagar',
            email: 'manasborisagar@darshan.ac.in',
            role: 'student',
            avatar: null,
            department: 'Engineering',
            mentorName: 'Arjun Bala'
        }
    };

    // ==============================================
    // LOGIN FUNCTION
    // ==============================================
    // Can accept either:
    // 1. A user object directly: login({ id, name, email, role })
    // 2. Three parameters: login(email, password, role)
    const login = (userDataOrEmail, password, role) => {
        let userData;

        // Check if first argument is an object (new format from Login.jsx)
        if (typeof userDataOrEmail === 'object' && userDataOrEmail !== null) {
            userData = userDataOrEmail;
        } else {
            // Old format: lookup from mockUsers by role
            userData = mockUsers[role];
        }

        // Save to state
        setUser(userData);

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

        return true;
    };

    // ==============================================
    // LOGOUT FUNCTION
    // ==============================================
    const logout = () => {
        setUser(null);
        // Clear user and JWT token from localStorage
        localStorage.removeItem(STORAGE_KEY);
        clearToken();
    };

    // ==============================================
    // UPDATE USER FUNCTION (for profile updates)
    // ==============================================
    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    };

    // ==============================================
    // PROVIDE THE CONTEXT
    // ==============================================
    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            updateUser,
            isAuthenticated: user !== null,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ==============================================
// useAuth HOOK
// ==============================================
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
