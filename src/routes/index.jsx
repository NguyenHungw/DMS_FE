import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import InformationSharing from '../pages/InformationSharing';
import UserManagement from '../pages/UserManagement';
import PermissionsManagement from '../pages/PermissionsManagement';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import InternalChat from '../pages/InternalChat';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="sharing" element={<InformationSharing />} />
                    <Route path="users" element={
                        <RoleProtectedRoute allowedRoles={['Administrator']}>
                            <UserManagement />
                        </RoleProtectedRoute>
                    } />
                    <Route path="permissions" element={
                        <RoleProtectedRoute allowedRoles={['Administrator']}>
                            <PermissionsManagement />
                        </RoleProtectedRoute>
                    } />
                    <Route path="chat" element={<InternalChat />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
