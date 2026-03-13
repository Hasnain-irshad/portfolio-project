import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import './Publications.css';

const Publications = ({ publications }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [filterType, setFilterType] = useState('year'); // 'year' or 'type'

    if (!publications || publications.length === 0) return null;

    // Collect unique years and types
    const years = useMemo(() => {
        const uniqueYears = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
        return uniqueYears;
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = [...new Set(publications.map(p => p.type).filter(Boolean))];
        return uniqueTypes;
    }, [publications]);

    const filteredPublications = useMemo(() => {
        if (activeFilter === 'all') return publications;
        if (filterType === 'year') {
            return publications.filter(p => p.year === parseInt(activeFilter));
        }
        return publications.filter(p => p.type === activeFilter);
    }, [publications, activeFilter, filterType]);

    const handleFilterTypeSwitch = (type) => {
        setFilterType(type);
        setActiveFilter('all');
    };

    const typeBadgeColor = {
        Journal: '#10b981',
        Conference: '#3b82f6',
        Thesis: '#8b5cf6',
        Book: '#f59e0b',
        Preprint: '#ef4444',
        Other: '#6b7280'
    };

    return (
        <section id="publications" className="section publications">
            <div className="container">
                <h2 className="section-title">Research & Publications</h2>

                {/* Filter Controls */}
                <div className="pub-filter-controls">
                    <div className="pub-filter-toggle">
                        <button
                            className={`pub-toggle-btn ${filterType === 'year' ? 'active' : ''}`}
                            onClick={() => handleFilterTypeSwitch('year')}
                        >
                            By Year
                        </button>
                        <button
                            className={`pub-toggle-btn ${filterType === 'type' ? 'active' : ''}`}
                            onClick={() => handleFilterTypeSwitch('type')}
                        >
                            By Type
                        </button>
                    </div>

                    <div className="pub-filters">
                        <button
                            className={`pub-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        {filterType === 'year'
                            ? years.map(year => (
                                <button
                                    key={year}
                                    className={`pub-filter-btn ${activeFilter === String(year) ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(String(year))}
                                >
                                    {year}
                                </button>
                            ))
                            : types.map(type => (
                                <button
                                    key={type}
                                    className={`pub-filter-btn ${activeFilter === type ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(type)}
                                >
                                    {type}
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="publications-grid">
                    {filteredPublications.map((pub, index) => (
                        <motion.div
                            key={pub._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className="publication-card card"
                        >
                            <div className="pub-card-header">
                                <span
                                    className="pub-type-badge"
                                    style={{ background: typeBadgeColor[pub.type] || '#6b7280' }}
                                >
                                    {pub.type}
                                </span>
                                <span className="pub-year">{pub.year}</span>
                            </div>

                            {pub.image?.url && (
                                <div className="pub-image">
                                    <img src={pub.image.url} alt={pub.title} />
                                </div>
                            )}

                            <h3 className="pub-title">{pub.title}</h3>

                            {pub.authors && pub.authors.length > 0 && (
                                <p className="pub-authors">
                                    <i className="fas fa-users"></i>
                                    {pub.authors.join(', ')}
                                </p>
                            )}

                            {pub.publisher && (
                                <p className="pub-publisher">{pub.publisher}</p>
                            )}

                            {pub.abstract && (
                                <p className="pub-abstract">
                                    {pub.abstract.length > 200
                                        ? pub.abstract.slice(0, 200) + '...'
                                        : pub.abstract}
                                </p>
                            )}

                            <div className="pub-links">
                                {pub.doi && (
                                    <a
                                        href={`https://doi.org/${pub.doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pub-link pub-link-doi"
                                    >
                                        <i className="fas fa-link"></i> DOI
                                    </a>
                                )}
                                {pub.externalUrl && (
                                    <a
                                        href={pub.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pub-link pub-link-external"
                                    >
                                        <i className="fas fa-external-link-alt"></i> View
                                    </a>
                                )}
                                {pub.document?.url && (
                                    <a
                                        href={pub.document.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pub-link pub-link-paper"
                                    >
                                        <i className="fas fa-file-pdf"></i>
                                        {pub.document.originalName || 'Paper'}
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredPublications.length === 0 && (
                    <p className="pub-empty">No publications found for this filter.</p>
                )}
            </div>
        </section>
    );
};

export default Publications;
