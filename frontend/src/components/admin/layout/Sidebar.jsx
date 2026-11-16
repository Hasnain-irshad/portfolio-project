import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../common/Icon';
import './Sidebar.css';

const menuItems = [
    { path: '/admin/dashboard', icon: 'sparkle', label: 'Dashboard' },
    { path: '/admin/messages', icon: 'mail', label: 'Messages' },
    { path: '/admin/profile', icon: 'users', label: 'Profile' },
    { path: '/admin/resume', icon: 'file-text', label: 'Resume' },
    { path: '/admin/projects', icon: 'briefcase', label: 'Projects' },
    { path: '/admin/skills', icon: 'code', label: 'Skills' },
    { path: '/admin/experience', icon: 'building', label: 'Experience' },
    { path: '/admin/education', icon: 'graduation', label: 'Education' },
    { path: '/admin/achievements', icon: 'trophy', label: 'Achievements' },
    { path: '/admin/certificates', icon: 'award', label: 'Certificates' },
    { path: '/admin/blogs', icon: 'book', label: 'Blogs' },
    { path: '/admin/publications', icon: 'file-text', label: 'Publications' },
    { path: '/admin/activities', icon: 'clock', label: 'Activities' },
];

// The sidebar is Prompt Blue in both themes, so it always uses dark tokens.
const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
    const location = useLocation();

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} data-theme="dark" aria-label="Admin navigation">
            <div className="sidebar-header">
                <h2 className="sidebar-logo">
                    <span className="brand__mark" aria-hidden="true">
                        A<span className="brand__dot" />
                    </span>
                    Portfolio Admin
                </h2>
                <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
                    <Icon name="close" width="18" height="18" />
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`sidebar-item ${active ? 'active' : ''}`}
                            aria-current={active ? 'page' : undefined}
                        >
                            <span className="sidebar-icon">
                                <Icon name={item.icon} />
                            </span>
                            <span className="sidebar-label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <Link to="/" className="sidebar-item sidebar-site-link">
                <span className="sidebar-icon">
                    <Icon name="arrow-up-right" />
                </span>
                <span className="sidebar-label">View public site</span>
            </Link>
        </aside>
    );
};

export default Sidebar;
