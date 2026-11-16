import React from 'react';
import SectionHeader from '../common/SectionHeader';
import ZoomableImage from '../common/ZoomableImage';
import Icon from '../common/Icon';
import { formatMonthYear } from '../../lib/format';
import './Recognition.css';

/* Achievements store a Font Awesome class (e.g. "fas fa-trophy"). Map the
   common ones to the inline icon set; the default "fa-star" falls back to a
   category icon so cards don't all look identical. */
const FA_MAP = {
    'fa-trophy': 'trophy',
    'fa-award': 'award',
    'fa-medal': 'award',
    'fa-certificate': 'award',
    'fa-graduation-cap': 'graduation',
    'fa-code': 'code',
    'fa-flag': 'flag',
    'fa-users': 'users',
    'fa-book': 'book',
    'fa-rocket': 'sparkle',
    'fa-lightbulb': 'sparkle',
};
const CATEGORY_ICON = {
    Award: 'trophy',
    Recognition: 'star',
    Milestone: 'flag',
    Competition: 'trophy',
    Certification: 'award',
};
const iconFor = (a) => {
    const fa = (a.icon || '').split(/\s+/).find((c) => c.startsWith('fa-') && FA_MAP[c]);
    return fa ? FA_MAP[fa] : CATEGORY_ICON[a.category] || 'star';
};

const Recognition = ({ index, achievements = [], certificates = [] }) => {
    if (!achievements.length && !certificates.length) return null;

    const items = [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date));
    // 3-col bento: a lead tile spanning 2 keeps rows full when n % 3 === 2.
    const leadSpans = items.length % 3 === 2;

    return (
        <section id="achievements" className="sec recognition" aria-labelledby="recognition-title">
            <div className="container">
                <SectionHeader
                    id="recognition-title"
                    index={index}
                    eyebrow="Recognition"
                    title={
                        <>
                            Awards &amp; <em>milestones</em>.
                        </>
                    }
                />

                {items.length > 0 && (
                    <ul role="list" className="bento">
                        {items.map((a, i) => (
                            <li
                                key={a._id}
                                className={`tile ach reveal ${i === 0 && leadSpans ? 'span-2 ach--lead' : ''}`}
                                style={{ '--reveal-delay': `${(i % 3) * 60}ms` }}
                            >
                                <div className="ach__top">
                                    <span className="ach__icon" aria-hidden="true">
                                        <Icon name={iconFor(a)} />
                                    </span>
                                    <span className="meta">{formatMonthYear(a.date)}</span>
                                </div>
                                {a.category && <p className="meta ach__cat">{a.category}</p>}
                                <h3 className="ach__title">{a.title}</h3>
                                {a.description && <p className="ach__desc">{a.description}</p>}
                            </li>
                        ))}
                    </ul>
                )}

                {certificates.length > 0 && (
                    <div id="certificates" className="certs">
                        <div className="sub-head reveal">
                            <h3>Certificates</h3>
                            <span className="meta">{String(certificates.length).padStart(2, '0')}</span>
                        </div>
                        <ul role="list" className="certs__grid">
                            {certificates.map((c, i) => (
                                <li key={c._id} className="tile tile--flush cert reveal" style={{ '--reveal-delay': `${(i % 3) * 60}ms` }}>
                                    {c.image?.url && (
                                        <div className="cert__media">
                                            <ZoomableImage src={c.image.url} alt={`${c.title} certificate`} widths={[400, 700]} sizes="(max-width: 640px) 100vw, 380px" />
                                        </div>
                                    )}
                                    <div className="cert__body">
                                        <p className="meta">
                                            {formatMonthYear(c.issueDate)}
                                            {c.expiryDate && ` — ${formatMonthYear(c.expiryDate)}`}
                                        </p>
                                        <h4 className="cert__title">{c.title}</h4>
                                        <p className="cert__issuer">{c.issuer}</p>
                                        {c.credentialId && <p className="meta cert__id">ID · {c.credentialId}</p>}
                                        {c.credentialUrl && (
                                            <a className="link-arrow cert__link" href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
                                                Verify credential <Icon name="arrow-up-right" />
                                                <span className="sr-only"> for {c.title}</span>
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Recognition;
