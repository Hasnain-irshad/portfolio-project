import React from 'react';
import { adminPublicationsAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const PublicationsManagement = () => {
    const fields = [
        { name: 'title', defaultValue: '' },
        { name: 'abstract', defaultValue: '' },
        { name: 'authors', defaultValue: '' },
        { name: 'type', defaultValue: 'Other' },
        { name: 'year', defaultValue: new Date().getFullYear() },
        { name: 'publisher', defaultValue: '' },
        { name: 'doi', defaultValue: '' },
        { name: 'externalUrl', defaultValue: '' },
        { name: 'isVisible', defaultValue: true }
    ];

    const typeBadgeColor = {
        Journal: '#10b981',
        Conference: '#3b82f6',
        Thesis: '#8b5cf6',
        Book: '#f59e0b',
        Preprint: '#ef4444',
        Other: '#6b7280'
    };

    const cardRender = (item, onEdit, onDelete, onToggleVisibility) => (
        <div className="project-card">
            {item.image && (
                <div className="project-image">
                    <img src={item.image.url} alt={item.title} />
                </div>
            )}
            <div className="project-content">
                <h3 className="project-title">📚 {item.title}</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                        background: typeBadgeColor[item.type] || '#6b7280',
                        color: '#fff',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600
                    }}>{item.type}</span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{item.year}</span>
                </div>
                {item.authors && item.authors.length > 0 && (
                    <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '6px', fontStyle: 'italic' }}>
                        {item.authors.join(', ')}
                    </p>
                )}
                {item.publisher && (
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
                        Publisher: {item.publisher}
                    </p>
                )}
                {item.abstract && (
                    <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>
                        {item.abstract.length > 120 ? item.abstract.slice(0, 120) + '...' : item.abstract}
                    </p>
                )}
                {item.document?.url && (
                    <a href={item.document.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#3b82f6', marginRight: '12px' }}>
                        📎 {item.document.originalName || 'Paper'}
                    </a>
                )}
                {item.doi && (
                    <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#8b5cf6' }}>
                        🔗 DOI
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
            <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={onChange} className="form-input" required />
            </div>

            <div className="form-group">
                <label className="form-label">Abstract *</label>
                <textarea name="abstract" value={formData.abstract || ''} onChange={onChange} className="form-textarea" rows="5" required />
            </div>

            <div className="form-group">
                <label className="form-label">Authors (comma separated)</label>
                <input type="text" name="authors" value={Array.isArray(formData.authors) ? formData.authors.join(', ') : (formData.authors || '')} onChange={onChange} className="form-input" placeholder="e.g. John Doe, Jane Smith" />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Type</label>
                    <select name="type" value={formData.type || 'Other'} onChange={onChange} className="form-input">
                        <option value="Journal">Journal</option>
                        <option value="Conference">Conference</option>
                        <option value="Thesis">Thesis</option>
                        <option value="Book">Book</option>
                        <option value="Preprint">Preprint</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Year *</label>
                    <input type="number" name="year" value={formData.year || ''} onChange={onChange} className="form-input" required min="1900" max="2099" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Publisher</label>
                    <input type="text" name="publisher" value={formData.publisher || ''} onChange={onChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-label">DOI</label>
                    <input type="text" name="doi" value={formData.doi || ''} onChange={onChange} className="form-input" placeholder="e.g. 10.1234/example" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">External URL</label>
                <input type="url" name="externalUrl" value={formData.externalUrl || ''} onChange={onChange} className="form-input" />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Cover Image</label>
                    <input type="file" onChange={(e) => onFileChange('image', e.target.files[0])} className="form-input" accept="image/*" />
                </div>
                <div className="form-group">
                    <label className="form-label">Paper/Document (PDF, DOCX)</label>
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
            title="Publication"
            api={adminPublicationsAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default PublicationsManagement;
