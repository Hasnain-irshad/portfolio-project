import React from 'react';
import { adminActivitiesAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const ActivitiesManagement = () => {
    const fields = [
        { name: 'title', defaultValue: '' },
        { name: 'role', defaultValue: '' },
        { name: 'description', defaultValue: '' },
        { name: 'startDate', defaultValue: '' },
        { name: 'current', defaultValue: true },
        { name: 'isVisible', defaultValue: true }
    ];

    const cardRender = (item, onEdit, onDelete, onToggleVisibility) => (
        <div className="project-card">
            {item.image && (
                <div className="project-image">
                    <img src={item.image.url} alt={item.title} />
                </div>
            )}
            <div className="project-content">
                <h3 className="project-title">🔄 {item.title}</h3>
                {item.role && (
                    <p style={{ fontWeight: 600, color: '#667eea', marginBottom: '6px', fontSize: '14px' }}>
                        {item.role}
                    </p>
                )}
                {item.startDate && (
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
                        Since {new Date(item.startDate).toLocaleDateString()}
                        {item.current && <span style={{
                            marginLeft: '8px',
                            background: '#10b981',
                            color: '#fff',
                            padding: '1px 8px',
                            borderRadius: '10px',
                            fontSize: '10px'
                        }}>Active</span>}
                    </p>
                )}
                {item.description && (
                    <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>
                        {item.description.length > 150 ? item.description.slice(0, 150) + '...' : item.description}
                    </p>
                )}
                {item.document?.url && (
                    <a href={item.document.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#3b82f6' }}>
                        📎 {item.document.originalName || 'Attachment'}
                    </a>
                )}
                {!item.isVisible && <div className="hidden-badge">Hidden</div>}
                <div className="project-actions">
                    <button onClick={() => onEdit(item)} className="btn-edit">Edit</button>
                    <button onClick={() => onToggleVisibility(item._id)} className="btn-toggle">
                        {item.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => onDelete(item._id)} className="btn-delete">Delete</button>
                </div>
            </div>
        </div>
    );

    const formRender = (formData, onChange, onFileChange) => (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={onChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Role</label>
                    <input type="text" name="role" value={formData.role || ''} onChange={onChange} className="form-input" placeholder="e.g. Lead Researcher" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={onChange} className="form-textarea" rows="4" />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate?.split('T')[0] || ''} onChange={onChange} className="form-input" />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
                    <label className="form-checkbox">
                        <input type="checkbox" name="current" checked={formData.current !== false} onChange={onChange} />
                        <span>Currently Active</span>
                    </label>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Image</label>
                    <input type="file" onChange={(e) => onFileChange('image', e.target.files[0])} className="form-input" accept="image/*" />
                </div>
                <div className="form-group">
                    <label className="form-label">Document (PDF, DOCX)</label>
                    <input type="file" onChange={(e) => onFileChange('document', e.target.files[0])} className="form-input" accept=".pdf,.doc,.docx" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-checkbox">
                    <input type="checkbox" name="isVisible" checked={formData.isVisible !== false} onChange={onChange} />
                    <span>Visible on portfolio</span>
                </label>
            </div>
        </>
    );

    return (
        <ListManagement
            title="Activity"
            api={adminActivitiesAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default ActivitiesManagement;
