import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
    const { admin, logout } = useAuth();

    return (
        <div className="admin-layout">
            <Sidebar />

            <div className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-content">
                        <h1 className="admin-page-title">Admin Dashboard</h1>
                        <div className="admin-header-actions">
                            <div className="admin-user-info">
                                <span className="admin-user-name">{admin?.name}</span>
                                <span className="admin-user-email">{admin?.email}</span>
                            </div>
                            <button onClick={logout} className="btn-logout">
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
