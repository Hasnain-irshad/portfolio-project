// Generic List Management Component for Experience, Education, Achievements, Certificates
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Modal from './Modal';
import Toast from './Toast';
import './ProjectsManagement.css';

const ListManagement = ({
    title,
    api,
    fields,
    cardRender,
    formRender
}) => {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.getAll(token);
            setItems(response.data.data);
        } catch (error) {
            showToast(`Failed to fetch ${title.toLowerCase()}`, 'error');
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

    const handleFileChange = (name, file) => {
        setFiles({ ...files, [name]: file });
    };

    const openAddModal = () => {
        setEditingItem(null);
        const initialData = {};
        fields.forEach(field => {
            initialData[field.name] = typeof field.defaultValue !== 'undefined' ? field.defaultValue : '';
        });
        setFormData(initialData);
        setFiles({});
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ ...item });
        setFiles({});
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // If any file inputs are present, send multipart/form-data.
            // Otherwise send JSON so express.json() + validators work correctly.
            const hasFiles = Object.values(files).some(f => f);

            if (hasFiles) {
                const submitData = new FormData();

                Object.keys(formData).forEach(key => {
                    if (formData[key] !== undefined && formData[key] !== null) {
                        // Convert boolean to string for FormData
                        const value = typeof formData[key] === 'boolean' ? String(formData[key]) : formData[key];
                        submitData.append(key, value);
                    }
                });

                Object.keys(files).forEach(key => {
                    if (files[key]) {
                        submitData.append(key, files[key]);
                    }
                });

                if (editingItem) {
                    await api.update(token, editingItem._id, submitData);
                    showToast(`${title} updated successfully!`);
                } else {
                    await api.create(token, submitData);
                    showToast(`${title} created successfully!`);
                }
            } else {
                // Prepare JSON payload
                const jsonPayload = { ...formData };

                // Normalize boolean strings if any inputs provided string booleans
                Object.keys(jsonPayload).forEach((k) => {
                    const v = jsonPayload[k];
                    if (typeof v === 'string') {
                        if (v === 'true') jsonPayload[k] = true;
                        else if (v === 'false') jsonPayload[k] = false;
                        else if (v.startsWith && v.startsWith('[') && v.endsWith && v.endsWith(']')) {
                            try {
                                jsonPayload[k] = JSON.parse(v);
                            } catch {
                                // leave as-is
                            }
                        }
                    }
                });

                if (editingItem) {
                    await api.update(token, editingItem._id, jsonPayload);
                    showToast(`${title} updated successfully!`);
                } else {
                    await api.create(token, jsonPayload);
                    showToast(`${title} created successfully!`);
                }
            }

            setIsModalOpen(false);
            fetchItems();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;

        try {
            await api.delete(token, id);
            showToast(`${title} deleted successfully!`);
            fetchItems();
        } catch (error) {
            showToast(`Failed to delete ${title.toLowerCase()}`, 'error');
        }
    };

    const handleToggleVisibility = async (id) => {
        if (!api.toggleVisibility) return;

        try {
            await api.toggleVisibility(token, id);
            showToast('Visibility updated!');
            fetchItems();
        } catch (error) {
            showToast('Failed to update visibility', 'error');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading {title.toLowerCase()}...</div>;
    }

    return (
        <div className="management-page">
            <div className="page-header">
                <h2 className="page-title">{title} Management</h2>
                <button onClick={openAddModal} className="btn-primary">
                    + Add {title}
                </button>
            </div>

            <div className="projects-grid">
                {items.length === 0 ? (
                    <div className="empty-state">
                        <p>No {title.toLowerCase()} yet. Click "Add {title}" to get started!</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item._id}>
                            {cardRender(item, openEditModal, handleDelete, handleToggleVisibility)}
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? `Edit ${title}` : `Add New ${title}`}
                size="large"
            >
                <form onSubmit={handleSubmit} className="project-form">
                    {formRender(formData, handleInputChange, handleFileChange, files)}

                    <div className="form-actions">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingItem ? `Update ${title}` : `Create ${title}`}
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

export default ListManagement;
