import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminProjectsAPI } from '../../services/adminApi';
import Modal from '../../components/admin/common/Modal';
import Toast from '../../components/admin/common/Toast';
import './ProjectsManagement.css';

const ProjectsManagement = () => {
    const { token } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        category: 'Web Development',
        projectUrl: '',
        githubUrl: '',
        isVisible: true,
        order: 0
    });
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await adminProjectsAPI.getAll(token);
            setProjects(response.data.data);
        } catch (error) {
            showToast('Failed to fetch projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        setImageFiles(Array.from(e.target.files));
    };

    const openAddModal = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            technologies: '',
            category: 'Web Development',
            projectUrl: '',
            githubUrl: '',
            isVisible: true,
            order: 0
        });
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies.join(', '),
            category: project.category || 'Web Development',
            projectUrl: project.projectUrl || '',
            githubUrl: project.githubUrl || '',
            isVisible: project.isVisible !== false,
            order: project.order || 0
        });
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('technologies', JSON.stringify(formData.technologies.split(',').map(t => t.trim())));
            submitData.append('category', formData.category);
            submitData.append('projectUrl', formData.projectUrl);
            submitData.append('githubUrl', formData.githubUrl);
            submitData.append('isVisible', formData.isVisible);
            submitData.append('order', formData.order);

            if (imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    submitData.append('images', file);
                });
            }

            if (editingProject) {
                await adminProjectsAPI.update(token, editingProject._id, submitData);
                showToast('Project updated successfully!');
            } else {
                await adminProjectsAPI.create(token, submitData);
                showToast('Project created successfully!');
            }

            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await adminProjectsAPI.delete(token, id);
            showToast('Project deleted successfully!');
            fetchProjects();
        } catch (error) {
            showToast('Failed to delete project', 'error');
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await adminProjectsAPI.toggleVisibility(token, id);
            showToast('Visibility updated!');
            fetchProjects();
        } catch (error) {
            showToast('Failed to update visibility', 'error');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading projects...</div>;
    }

    return (
        <div className="management-page">
            <div className="page-header">
                <h2 className="page-title">Projects Management</h2>
                <button onClick={openAddModal} className="btn-primary">
                    + Add Project
                </button>
            </div>

            <div className="projects-grid">
                {projects.length === 0 ? (
                    <div className="empty-state">
                        <p>No projects yet. Click "Add Project" to get started!</p>
                    </div>
                ) : (
                    projects.map(project => (
                        <div key={project._id} className="project-card">
                            {project.images && project.images.length > 0 && (
                                <div className="project-image">
                                    <img src={project.images[0].url} alt={project.title} />
                                    {!project.isVisible && (
                                        <div className="hidden-badge">Hidden</div>
                                    )}
                                </div>
                            )}
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                <div className="project-technologies">
                                    {project.technologies.map((tech, idx) => (
                                        <span key={idx} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                                <div className="project-actions">
                                    <button onClick={() => openEditModal(project)} className="btn-edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleToggleVisibility(project._id)} className="btn-toggle">
                                        {project.isVisible ? 'Hide' : 'Show'}
                                    </button>
                                    <button onClick={() => handleDelete(project._id)} className="btn-delete">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProject ? 'Edit Project' : 'Add New Project'}
                size="large"
            >
                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            >
                                <option>Web Development</option>
                                <option>Mobile App</option>
                                <option>Desktop App</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-textarea"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Technologies (comma-separated) *</label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="React, Node.js, MongoDB"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Project URL</label>
                            <input
                                type="url"
                                name="projectUrl"
                                value={formData.projectUrl}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="https://project-demo.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">GitHub URL</label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="https://github.com/username/repo"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                className="form-input"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-checkbox">
                                <input
                                    type="checkbox"
                                    name="isVisible"
                                    checked={formData.isVisible}
                                    onChange={handleInputChange}
                                />
                                <span>Visible on portfolio</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Project Images (max 5)</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="form-input"
                            accept="image/*"
                            multiple
                        />
                        {imageFiles.length > 0 && (
                            <p className="form-hint">{imageFiles.length} file(s) selected</p>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingProject ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </Modal>

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

export default ProjectsManagement;
