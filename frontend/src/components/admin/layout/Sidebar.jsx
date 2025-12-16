import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/profile', icon: '👤', label: 'Profile' },
        { path: '/admin/resume', icon: '📄', label: 'Resume' },
        { path: '/admin/projects', icon: '💼', label: 'Projects' },
        { path: '/admin/skills', icon: '⚡', label: 'Skills' },
        { path: '/admin/experience', icon: '💻', label: 'Experience' },
        { path: '/admin/education', icon: '🎓', label: 'Education' },
        { path: '/admin/achievements', icon: '🏆', label: 'Achievements' },
        { path: '/admin/certificates', icon: '📜', label: 'Certificates' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-logo">📁 Portfolio Admin</h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
