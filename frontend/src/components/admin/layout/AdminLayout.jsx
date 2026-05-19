import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
    const { admin, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const closeSidebar = () => setSidebarOpen(false);

    // Close the drawer whenever the route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Lock body scroll while the mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    return (
        <div className="admin-layout">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {sidebarOpen && (
                <div
                    className="admin-sidebar-backdrop"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <div className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-content">
                        <div className="admin-header-left">
                            <button
                                className="admin-menu-toggle"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open menu"
                            >
                                <i className="fas fa-bars"></i>
                            </button>
                            <h1 className="admin-page-title">Admin Dashboard</h1>
                        </div>
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
