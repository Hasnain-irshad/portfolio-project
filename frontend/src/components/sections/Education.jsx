import React from 'react';
import SectionHeader from '../common/SectionHeader';
import Icon from '../common/Icon';
import { useLightbox } from '../../contexts/LightboxContext';
import { formatYear } from '../../lib/format';
import './Education.css';

const Transcript = ({ edu }) => {
    const { openLightbox } = useLightbox();
    const t = edu.transcript;
    if (!t?.url) return null;

    if (t.fileType === 'image') {
        return (
            <button type="button" className="link-arrow edu__proof" onClick={() => openLightbox(t.url, `${edu.degree} — transcript`)}>
                <Icon name="image" /> View transcript
                <span className="sr-only"> for {edu.degree}</span>
            </button>
        );
    }
    return (
        <a className="link-arrow edu__proof" href={t.url} target="_blank" rel="noopener noreferrer">
            <Icon name="file-text" /> {t.originalName || 'Transcript (PDF)'}
            <span className="sr-only"> for {edu.degree}</span>
        </a>
    );
};

const Education = ({ index, education }) => {
    if (!education?.length) return null;

    const items = [...education].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    return (
        <section id="education" className="sec education" aria-labelledby="education-title">
            <div className="container">
                <SectionHeader
                    id="education-title"
                    index={index}
                    eyebrow="Education"
                    title={
                        <>
                            Foundations &amp; <em>study</em>.
                        </>
                    }
                />

                <ol role="list" className="edu">
                    {items.map((edu) => {
                        const start = formatYear(edu.startDate);
                        const end = edu.current ? 'Present' : formatYear(edu.endDate);
                        return (
                            <li key={edu._id} className="edu__row reveal">
                                <p className="edu__years meta">
                                    {start}
                                    {end && end !== start ? ` — ${end}` : ''}
                                </p>
                                <div className="edu__main">
                                    <h3 className="edu__degree">{edu.degree}</h3>
                                    <p className="edu__school">
                                        {edu.school}
                                        {edu.location && <span className="edu__loc"> · {edu.location}</span>}
                                    </p>
                                    {edu.description && <p className="edu__desc">{edu.description}</p>}
                                    {edu.activities?.length > 0 && (
                                        <ul role="list" className="chip-list edu__acts" aria-label="Activities and societies">
                                            {edu.activities.map((a, i) => (
                                                <li key={i} className="chip">{a}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="edu__side">
                                    {edu.grade && (
                                        <p className="edu__grade">
                                            <span className="meta">Result</span>
                                            <span>{edu.grade}</span>
                                        </p>
                                    )}
                                    <Transcript edu={edu} />
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
};

export default Education;
