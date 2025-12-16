import React from 'react';
import { adminAchievementsAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const AchievementsManagement = () => {
    const fields = [
        { name: 'title', defaultValue: '' },
        { name: 'description', defaultValue: '' },
        { name: 'category', defaultValue: 'Award' },
        { name: 'date', defaultValue: '' },
        { name: 'isVisible', defaultValue: true }
    ];

    const cardRender = (item, onEdit, onDelete, onToggleVisibility) => (
        <div className="project-card">
            <div className="project-content">
                <h3 className="project-title">🏆 {item.title}</h3>
                {item.category && <p style={{ fontWeight: 600, color: '#667eea', marginBottom: '8px' }}>{item.category}</p>}
                <p className="project-description">{item.description}</p>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                    {new Date(item.date).toLocaleDateString()}
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

    const formRender = (formData, onChange, onFileChange) => (
        <>
            <div className="form-group">
                <label className="form-label">Achievement Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={onChange} className="form-input" required />
            </div>

            <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={formData.description || ''} onChange={onChange} className="form-textarea" rows="4" required />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" value={formData.category || 'Award'} onChange={onChange} className="form-input">
                        <option value="Award">Award</option>
                        <option value="Recognition">Recognition</option>
                        <option value="Milestone">Milestone</option>
                        <option value="Competition">Competition</option>
                        <option value="Certification">Certification</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input type="date" name="date" value={formData.date?.split('T')[0] || ''} onChange={onChange} className="form-input" required />
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
            title="Achievement"
            api={adminAchievementsAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default AchievementsManagement;
