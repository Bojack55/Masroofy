import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ParentDashboard from './components/ParentDashboard';
import ChildDashboard from './components/ChildDashboard';

function App() {
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    const getUserRole = () => {
        return localStorage.getItem('userRole');
    };

    const ProtectedRoute = ({ children, allowedRole }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" replace />;
        }

        const userRole = getUserRole();
        if (allowedRole && userRole !== allowedRole) {
            return <Navigate to={userRole === 'parent' ? '/dashboard' : '/child-dashboard'} replace />;
        }

        return children;
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated()
                            ? <Navigate to={getUserRole() === 'parent' ? '/dashboard' : '/child-dashboard'} replace />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRole="parent">
                            <ParentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/child-dashboard"
                    element={
                        <ProtectedRoute allowedRole="child">
                            <ChildDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
