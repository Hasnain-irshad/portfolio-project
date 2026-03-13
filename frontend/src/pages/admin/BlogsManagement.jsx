import React from 'react';
import { adminBlogsAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const BlogsManagement = () => {
    const fields = [
        { name: 'title', defaultValue: '' },
        { name: 'content', defaultValue: '' },
        { name: 'excerpt', defaultValue: '' },
        { name: 'tags', defaultValue: '' },
        { name: 'publishDate', defaultValue: '' },
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
                <h3 className="project-title">📝 {item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    {new Date(item.publishDate || item.createdAt).toLocaleDateString()}
                </p>
                {item.excerpt && (
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                        {item.excerpt}
                    </p>
                )}
                {item.tags && item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {item.tags.map((tag, i) => (
                            <span key={i} style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: '#fff',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px'
                            }}>{tag}</span>
                        ))}
                    </div>
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
            <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={onChange} className="form-input" required />
            </div>

            <div className="form-group">
                <label className="form-label">Content *</label>
                <textarea name="content" value={formData.content || ''} onChange={onChange} className="form-textarea" rows="6" required />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Excerpt (Short Summary)</label>
                    <input type="text" name="excerpt" value={formData.excerpt || ''} onChange={onChange} className="form-input" maxLength="200" />
                </div>
                <div className="form-group">
                    <label className="form-label">Publish Date</label>
                    <input type="date" name="publishDate" value={formData.publishDate?.split('T')[0] || ''} onChange={onChange} className="form-input" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input type="text" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')} onChange={onChange} className="form-input" placeholder="e.g. React, Web Dev, AI" />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Cover Image</label>
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
            title="Blog"
            api={adminBlogsAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default BlogsManagement;
