import React from 'react';
import './Loading.css';

const Loading = ({ label = 'Loading' }) => (
    <div className="loading" role="status" aria-live="polite">
        <span className="loading__spinner" aria-hidden="true" />
        <span className="sr-only">{label}…</span>
    </div>
);

export default Loading;
