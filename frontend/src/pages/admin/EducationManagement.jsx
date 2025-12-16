import React from 'react';
import { adminEducationAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const EducationManagement = () => {
    const fields = [
        { name: 'school', defaultValue: '' },
        { name: 'degree', defaultValue: '' },
        { name: 'field', defaultValue: '' },
        { name: 'startDate', defaultValue: '' },
        { name: 'endDate', defaultValue: '' },
        { name: 'description', defaultValue: '' },
        { name: 'grade', defaultValue: '' },
        { name: 'current', defaultValue: false },
        { name: 'isVisible', defaultValue: true }
    ];

    const cardRender = (item, onEdit, onDelete, onToggleVisibility) => (
        <div className="project-card">
            <div className="project-content">
                <h3 className="project-title">{item.degree}</h3>
                <p style={{ fontWeight: 600, color: '#667eea', marginBottom: '4px' }}>{item.school}</p>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{item.field}</p>
                {item.grade && <p style={{ fontSize: '13px', color: '#4b5563' }}>Grade: {item.grade}</p>}
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                    {new Date(item.startDate).getFullYear()} - {item.current ? 'Present' : new Date(item.endDate).getFullYear()}
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

    const formRender = (formData, onChange) => (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Institution *</label>
                    <input type="text" name="school" value={formData.school || ''} onChange={onChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Degree *</label>
                    <input type="text" name="degree" value={formData.degree || ''} onChange={onChange} className="form-input" placeholder="e.g., Bachelor of Science" required />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Field of Study *</label>
                    <input type="text" name="field" value={formData.field || ''} onChange={onChange} className="form-input" placeholder="e.g., Computer Science" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Grade/GPA</label>
                    <input type="text" name="grade" value={formData.grade || ''} onChange={onChange} className="form-input" placeholder="e.g., 3.8/4.0" />
                </div>
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

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={onChange} className="form-textarea" rows="3" />
            </div>

            <div className="form-group">
                <label className="form-checkbox">
                    <input type="checkbox" name="current" checked={formData.current || false} onChange={onChange} />
                    <span>Currently studying here</span>
                </label>
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
            title="Education"
            api={adminEducationAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default EducationManagement;
