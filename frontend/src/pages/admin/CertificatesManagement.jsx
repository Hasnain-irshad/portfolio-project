import React from 'react';
import { adminCertificatesAPI } from '../../services/adminApi';
import ListManagement from '../../components/admin/common/ListManagement';

const CertificatesManagement = () => {
    const fields = [
        { name: 'name', defaultValue: '' },
        { name: 'issuingOrganization', defaultValue: '' },
        { name: 'issueDate', defaultValue: '' },
        { name: 'expiryDate', defaultValue: '' },
        { name: 'credentialId', defaultValue: '' },
        { name: 'credentialUrl', defaultValue: '' },
        { name: 'description', defaultValue: '' },
        { name: 'isVisible', defaultValue: true }
    ];

    const cardRender = (item, onEdit, onDelete, onToggleVisibility) => (
        <div className="project-card">
            {item.image && (
                <div className="project-image">
                    <img src={item.image.url} alt={item.name} />
                </div>
            )}
            <div className="project-content">
                <h3 className="project-title">📜 {item.name}</h3>
                <p style={{ fontWeight: 600, color: '#667eea', marginBottom: '8px' }}>{item.issuingOrganization}</p>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    Issued: {new Date(item.issueDate).toLocaleDateString()}
                </p>
                {item.credentialId && <p style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {item.credentialId}</p>}
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
                    <label className="form-label">Certificate Name *</label>
                    <input type="text" name="name" value={formData.name || ''} onChange={onChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Issuing Organization *</label>
                    <input type="text" name="issuingOrganization" value={formData.issuingOrganization || ''} onChange={onChange} className="form-input" required />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Issue Date *</label>
                    <input type="date" name="issueDate" value={formData.issueDate?.split('T')[0] || ''} onChange={onChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input type="date" name="expiryDate" value={formData.expiryDate?.split('T')[0] || ''} onChange={onChange} className="form-input" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Credential ID</label>
                    <input type="text" name="credentialId" value={formData.credentialId || ''} onChange={onChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-label">Credential URL</label>
                    <input type="url" name="credentialUrl" value={formData.credentialUrl || ''} onChange={onChange} className="form-input" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={onChange} className="form-textarea" rows="3" />
            </div>

            <div className="form-group">
                <label className="form-label">Certificate Image</label>
                <input type="file" onChange={(e) => onFileChange('image', e.target.files[0])} className="form-input" accept="image/*" />
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
            title="Certificate"
            api={adminCertificatesAPI}
            fields={fields}
            cardRender={cardRender}
            formRender={formRender}
        />
    );
};

export default CertificatesManagement;
