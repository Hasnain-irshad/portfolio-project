import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminProfileAPI } from '../../services/adminApi';
import Toast from '../../components/admin/common/Toast';
import '../admin/ProjectsManagement.css';

const ProfileManagement = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: ''
    });
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await adminProfileAPI.get(token);
            if (response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.log('No existing profile');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData._id) {
                await adminProfileAPI.update(token, formData);
                showToast('Profile updated successfully!');
            } else {
                await adminProfileAPI.create(token, formData);
                showToast('Profile created successfully!');
            }
            fetchProfile();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatar) return;

        try {
            const formData = new FormData();
            formData.append('image', avatar);
            await adminProfileAPI.uploadAvatar(token, formData);
            showToast('Avatar uploaded successfully!');
            setAvatar(null);
            fetchProfile();
        } catch (error) {
            showToast('Failed to upload avatar', 'error');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading profile...</div>;
    }

    return (
        <div className="management-page">
            <div className="page-header">
                <h2 className="page-title">Profile Management</h2>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                        <h3 className="form-section-title">Basic Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Professional Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g., Full Stack Developer"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio *</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows="5"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Contact Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="City, Country"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Social Links</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Twitter</label>
                            <input
                                type="url"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="https://twitter.com/username"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {formData._id ? 'Update Profile' : 'Create Profile'}
                        </button>
                    </div>
                </form>

                <div className="avatar-section">
                    <h3 className="form-section-title">Profile Avatar</h3>
                    {formData.avatar && (
                        <div className="current-avatar">
                            <img src={formData.avatar.url} alt="Profile" />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Upload New Avatar</label>
                        <input
                            type="file"
                            onChange={handleAvatarChange}
                            className="form-input"
                            accept="image/*"
                        />
                        {avatar && (
                            <button type="button" onClick={handleAvatarUpload} className="btn-primary" style={{ marginTop: '12px' }}>
                                Upload Avatar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ProfileManagement;
