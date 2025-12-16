import React from 'react';
import { adminExperienceAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const ExperienceManagement = () => {
    const fields = [
        { name: 'company', defaultValue: '' },
        { name: 'position', defaultValue: '' },
        { name: 'description', defaultValue: '' },
        { name: 'startDate', defaultValue: '' },
        { name: 'endDate', defaultValue: '' },
        { name: 'current', defaultValue: false },
        { name: 'location', defaultValue: '' },
        { name: 'isVisible', defaultValue: true }
    ];

    const cardRender = (item, onEdit, onDelete, onToggleVisibility) => (
        <div className="project-card">
            <div className="project-content">
                <h3 className="project-title">{item.position}</h3>
                <p style={{ fontWeight: 600, color: '#667eea', marginBottom: '8px' }}>{item.company}</p>
                <p className="project-description">{item.description}</p>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                    {new Date(item.startDate).toLocaleDateString()} -
                    {item.current ? ' Present' : ` ${new Date(item.endDate).toLocaleDateString()}`}
                </p>
                {!item.isVisible && <div className="hidden-badge" style={{ position: 'relative', top: 0, right: 0, marginTop: '8px' }}>Hidden</div>}
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

    const formRender = (formData, onChange, onFileChange, files) => (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input type="text" name="company" value={formData.company || ''} onChange={onChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Position *</label>
                    <input type="text" name="position" value={formData.position || ''} onChange={onChange} className="form-input" required />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={formData.description || ''} onChange={onChange} className="form-textarea" rows="4" required />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input type="date" name="startDate" value={formData.startDate?.split('T')[0] || ''} onChange={onChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" name="endDate" value={formData.endDate?.split('T')[0] || ''} onChange={onChange} className="form-input" disabled={formData.current} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" name="location" value={formData.location || ''} onChange={onChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-checkbox">
                        <input type="checkbox" name="current" checked={formData.current || false} onChange={onChange} />
                        <span>Currently working here</span>
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Company Logo (optional)</label>
                <input type="file" onChange={(e) => onFileChange('logo', e.target.files[0])} className="form-input" accept="image/*" />
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
            title="Experience"
            api={adminExperienceAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default ExperienceManagement;
