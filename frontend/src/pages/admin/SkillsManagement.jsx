import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminSkillsAPI } from '../../services/adminApi';
import Modal from '../../components/admin/common/Modal';
import Toast from '../../components/admin/common/Toast';
import '../admin/ProjectsManagement.css';

const SkillsManagement = () => {
    const { token } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        proficiencyLevel: 80
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await adminSkillsAPI.getAll(token);
            setSkills(response.data.data.skills || response.data.data);
        } catch (error) {
            showToast('Failed to fetch skills', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'proficiencyLevel' ? Number(value) : value
        });
    };

    const openAddModal = () => {
        setEditingSkill(null);
        setFormData({
            name: '',
            category: 'Frontend',
            proficiencyLevel: 80
        });
        setIsModalOpen(true);
    };

    const openEditModal = (skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            category: skill.category,
            proficiencyLevel: typeof skill.proficiencyLevel === 'number' ? skill.proficiencyLevel : (
                skill.proficiency === 'Expert' ? 90 : skill.proficiency === 'Advanced' ? 70 : skill.proficiency === 'Intermediate' ? 40 : 10
            )
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Map numeric level to enum label
            const mapLevelToLabel = (level) => {
                if (level >= 76) return 'Expert';
                if (level >= 51) return 'Advanced';
                if (level >= 26) return 'Intermediate';
                return 'Beginner';
            };

            const payload = {
                ...formData,
                proficiency: mapLevelToLabel(formData.proficiencyLevel),
                proficiencyLevel: formData.proficiencyLevel
            };

            if (editingSkill) {
                await adminSkillsAPI.update(token, editingSkill._id, payload);
                showToast('Skill updated successfully!');
            } else {
                await adminSkillsAPI.create(token, payload);
                showToast('Skill created successfully!');
            }

            setIsModalOpen(false);
            fetchSkills();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            await adminSkillsAPI.delete(token, id);
            showToast('Skill deleted successfully!');
            fetchSkills();
        } catch (error) {
            showToast('Failed to delete skill', 'error');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading skills...</div>;
    }

    return (
        <div className="management-page">
            <div className="page-header">
                <h2 className="page-title">Skills Management</h2>
                <button onClick={openAddModal} className="btn-primary">
                    + Add Skill
                </button>
            </div>

            <div className="skills-list">
                {skills.length === 0 ? (
                    <div className="empty-state">
                        <p>No skills yet. Click "Add Skill" to get started!</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Skill Name</th>
                                    <th>Category</th>
                                    <th>Proficiency</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map(skill => (
                                    <tr key={skill._id}>
                                        <td className="skill-name">{skill.name}</td>
                                        <td><span className="category-badge">{skill.category}</span></td>
                                        <td>
                                            <div className="proficiency-bar">
                                                {(() => {
                                                    const lvl = typeof skill.proficiencyLevel === 'number' ? skill.proficiencyLevel : (skill.proficiency === 'Expert' ? 90 : skill.proficiency === 'Advanced' ? 70 : skill.proficiency === 'Intermediate' ? 40 : 10);
                                                    return (
                                                        <div className="proficiency-fill" style={{ width: `${lvl}%` }}>
                                                            {lvl}%
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button onClick={() => openEditModal(skill)} className="btn-edit-small">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(skill._id)} className="btn-delete-small">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
            >
                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-group">
                        <label className="form-label">Skill Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g., React, Node.js, Python"
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
                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>Database</option>
                            <option>DevOps</option>
                            <option>Tools</option>
                            <option>Design</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Proficiency: {formData.proficiencyLevel}%</label>
                        <input
                            type="range"
                            name="proficiencyLevel"
                            value={formData.proficiencyLevel}
                            onChange={handleInputChange}
                            className="form-range"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingSkill ? 'Update Skill' : 'Create Skill'}
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

export default SkillsManagement;
