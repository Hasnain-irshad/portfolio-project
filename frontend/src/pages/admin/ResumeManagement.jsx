import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminResumeAPI } from '../../services/adminApi';
import Toast from '../../components/admin/common/Toast';
import '../admin/ProjectsManagement.css';

const ResumeManagement = () => {
    const { token } = useAuth();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            const response = await adminResumeAPI.get(token);
            setResume(response.data.data);
        } catch (error) {
            console.log('No resume uploaded yet');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            showToast('Please select a file', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('resume', file);

            await adminResumeAPI.upload(token, formData);
            showToast('Resume uploaded successfully!');
            setFile(null);
            fetchResume();
        } catch (error) {
            showToast(error.response?.data?.message || 'Upload failed', 'error');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete your resume?')) return;

        try {
            await adminResumeAPI.delete(token, resume._id);
            showToast('Resume deleted successfully!');
            setResume(null);
        } catch (error) {
            showToast('Failed to delete resume', 'error');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading resume...</div>;
    }

    return (
        <div className="management-page">
            <div className="page-header">
                <h2 className="page-title">Resume Management</h2>
            </div>

            <div className="form-container">
                {resume && (
                    <div className="resume-current">
                        <h3 className="form-section-title">Current Resume</h3>
                        <div className="resume-info">
                            <div className="resume-details">
                                <p><strong>Filename:</strong> {resume.fileName || resume.filename}</p>
                                <p><strong>Uploaded:</strong> {new Date(resume.uploadedAt || resume.uploaded_at).toLocaleDateString()}</p>
                                <div className="resume-actions">
                                    <a
                                        href={`https://docs.google.com/gview?url=${encodeURIComponent(resume.fileUrl || resume.url)}&embedded=true`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                    >
                                        View Resume
                                    </a>
                                    <button onClick={handleDelete} className="btn-delete">
                                        Delete Resume
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="resume-upload">
                    <h3 className="form-section-title">
                        {resume ? 'Upload New Resume' : 'Upload Resume'}
                    </h3>
                    <form onSubmit={handleUpload} className="upload-form">
                        <div className="form-group">
                            <label className="form-label">Select PDF file</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="form-input"
                                accept=".pdf,.doc,.docx"
                                required
                            />
                            {file && (
                                <p className="form-hint">Selected: {file.name}</p>
                            )}
                        </div>
                        <button type="submit" className="btn-primary">
                            Upload Resume
                        </button>
                    </form>
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

export default ResumeManagement;
