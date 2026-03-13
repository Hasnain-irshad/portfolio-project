import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { admin } = useAuth();
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experience: 0,
        certificates: 0
    });

    useEffect(() => {
        // You can fetch actual stats from your API here
        // For now, showing a welcome message
    }, []);

    const quickActions = [
        { icon: '💼', label: 'Add Project', link: '/admin/projects', color: '#3b82f6' },
        { icon: '⚡', label: 'Add Skill', link: '/admin/skills', color: '#10b981' },
        { icon: '💻', label: 'Add Experience', link: '/admin/experience', color: '#f59e0b' },
        { icon: '📜', label: 'Add Certificate', link: '/admin/certificates', color: '#8b5cf6' },
        { icon: '📝', label: 'Add Blog', link: '/admin/blogs', color: '#ec4899' },
        { icon: '📚', label: 'Add Publication', link: '/admin/publications', color: '#14b8a6' },
        { icon: '🔄', label: 'Add Activity', link: '/admin/activities', color: '#f97316' },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-welcome">
                <h2 className="dashboard-title">Welcome back, {admin?.name}! 👋</h2>
                <p className="dashboard-subtitle">
                    Manage your portfolio content from this dashboard. All changes are reflected on your public portfolio immediately.
                </p>
            </div>

            <div className="quick-actions">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <a
                            key={index}
                            href={action.link}
                            className="quick-action-card"
                            style={{ borderLeftColor: action.color }}
                        >
                            <span className="quick-action-icon">{action.icon}</span>
                            <span className="quick-action-label">{action.label}</span>
                        </a>
                    ))}
                </div>
            </div>

            <div className="dashboard-info">
                <div className="info-card">
                    <h3 className="info-card-title">Getting Started</h3>
                    <ul className="info-list">
                        <li>Update your profile information and upload a professional photo</li>
                        <li>Add your work experience and education history</li>
                        <li>Showcase your projects with images and descriptions</li>
                        <li>List your skills and proficiency levels</li>
                        <li>Upload certificates and achievements</li>
                        <li>Keep your resume up to date</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h3 className="info-card-title">Tips</h3>
                    <ul className="info-list">
                        <li>✅ Use high-quality images for better presentation</li>
                        <li>✅ Keep descriptions concise and professional</li>
                        <li>✅ Regularly update your content to stay relevant</li>
                        <li>✅ Use the visibility toggle to show/hide items</li>
                        <li>✅ Preview changes on your public portfolio</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
