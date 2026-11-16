import React, { useMemo, useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import Icon from '../common/Icon';
import './Publications.css';

const Publications = ({ index, publications = [] }) => {
    // Hooks run unconditionally (previously they ran after an early return,
    // which crashes React when the list goes from empty to populated).
    const [mode, setMode] = useState('year'); // 'year' | 'type'
    const [filter, setFilter] = useState('all');

    const years = useMemo(() => [...new Set(publications.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a), [publications]);
    const types = useMemo(() => [...new Set(publications.map((p) => p.type).filter(Boolean))], [publications]);

    const shown = useMemo(() => {
        if (filter === 'all') return publications;
        return mode === 'year'
            ? publications.filter((p) => String(p.year) === filter)
            : publications.filter((p) => p.type === filter);
    }, [publications, filter, mode]);

    if (!publications.length) return null;

    const options = mode === 'year' ? years.map(String) : types;

    return (
        <section id="publications" className="sec publications" aria-labelledby="publications-title">
            <div className="container">
                <SectionHeader
                    id="publications-title"
                    index={index}
                    eyebrow="Research"
                    title={
                        <>
                            Papers &amp; <em>publications</em>.
                        </>
                    }
                />

                <div className="pub-filters reveal">
                    <div className="segmented" role="group" aria-label="Group publications by">
                        {['year', 'type'].map((m) => (
                            <button
                                key={m}
                                type="button"
                                className={`segmented__btn ${mode === m ? 'is-active' : ''}`}
                                aria-pressed={mode === m}
                                onClick={() => {
                                    setMode(m);
                                    setFilter('all');
                                }}
                            >
                                By {m}
                            </button>
                        ))}
                    </div>
                    <div className="chip-list" role="group" aria-label="Filter publications">
                        {['all', ...options].map((o) => (
                            <button
                                key={o}
                                type="button"
                                className={`chip pub-filter ${filter === o ? 'chip--accent' : ''}`}
                                aria-pressed={filter === o}
                                onClick={() => setFilter(o)}
                            >
                                {o === 'all' ? 'All' : o}
                            </button>
                        ))}
                    </div>
                </div>

                <ol role="list" className="pubs">
                    {shown.map((p) => (
                        <li key={p._id} className="pub reveal">
                            <div className="pub__meta">
                                <span className="meta">{p.year}</span>
                                {p.type && <span className="chip chip--mono">{p.type}</span>}
                            </div>
                            <div>
                                <h3 className="pub__title">{p.title}</h3>
                                {p.authors?.length > 0 && <p className="pub__authors">{p.authors.join(', ')}</p>}
                                {p.publisher && <p className="meta pub__venue">{p.publisher}</p>}
                                {p.abstract && (
                                    <p className="pub__abstract">{p.abstract.length > 260 ? `${p.abstract.slice(0, 260).trim()}…` : p.abstract}</p>
                                )}
                                <div className="pub__links">
                                    {p.doi && (
                                        <a className="link-arrow" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                                            <Icon name="link" /> DOI <span className="sr-only">for {p.title}</span>
                                        </a>
                                    )}
                                    {p.externalUrl && (
                                        <a className="link-arrow" href={p.externalUrl} target="_blank" rel="noopener noreferrer">
                                            Read online <Icon name="arrow-up-right" /> <span className="sr-only">{p.title}</span>
                                        </a>
                                    )}
                                    {p.document?.url && (
                                        <a className="link-arrow" href={p.document.url} target="_blank" rel="noopener noreferrer">
                                            <Icon name="file-text" /> {p.document.originalName || 'Paper (PDF)'}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
                {shown.length === 0 && <p className="pub__empty">No publications match this filter.</p>}
            </div>
        </section>
    );
};

export default Publications;
