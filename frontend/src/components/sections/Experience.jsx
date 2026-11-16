import React from 'react';
import SectionHeader from '../common/SectionHeader';
import Icon from '../common/Icon';
import { cld } from '../../lib/media';
import { formatRange } from '../../lib/format';
import './Experience.css';

const Experience = ({ index, experiences }) => {
    if (!experiences?.length) return null;

    // Current roles first, then most recent.
    const items = [...experiences].sort(
        (a, b) => Number(!!b.current) - Number(!!a.current) || new Date(b.startDate) - new Date(a.startDate)
    );

    return (
        <section id="experience" className="sec experience" aria-labelledby="experience-title">
            <div className="container">
                <SectionHeader
                    id="experience-title"
                    index={index}
                    eyebrow="Experience"
                    title={
                        <>
                            Where I&rsquo;ve <em>shipped</em>.
                        </>
                    }
                />

                <ol role="list" className="bento bento--2 xp">
                    {items.map((exp, i) => {
                        const lead = i === 0;
                        return (
                            <li
                                key={exp._id}
                                className={`tile tile--interactive xp__item reveal ${lead ? 'span-2 xp__item--lead' : ''}`}
                                style={{ '--reveal-delay': `${Math.min(i, 3) * 70}ms` }}
                            >
                                <div className="xp__top">
                                    <span className="xp__dates meta">{formatRange(exp.startDate, exp.endDate, exp.current)}</span>
                                    {exp.current && (
                                        <span className="chip chip--accent chip--mono">
                                            <span className="status-dot" aria-hidden="true" /> Now
                                        </span>
                                    )}
                                </div>

                                <div className="xp__head">
                                    {exp.logo?.url ? (
                                        <img
                                            className="xp__logo"
                                            src={cld(exp.logo.url, { w: 96, h: 96, crop: 'fit' })}
                                            alt=""
                                            width="48"
                                            height="48"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <span className="xp__logo xp__logo--empty" aria-hidden="true">
                                            <Icon name="briefcase" />
                                        </span>
                                    )}
                                    <div>
                                        <h3 className="xp__role">{exp.position}</h3>
                                        <p className="xp__company">{exp.company}</p>
                                    </div>
                                </div>

                                {exp.description && <p className="xp__desc">{exp.description}</p>}

                                {exp.achievements?.length > 0 && (
                                    <ul role="list" className="xp__wins">
                                        {exp.achievements.map((a, idx) => (
                                            <li key={idx}>
                                                <Icon name="check" />
                                                <span>{a}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="chip-list xp__tags">
                                    {exp.type && <span className="chip">{exp.type}</span>}
                                    {exp.location && (
                                        <span className="chip">
                                            <Icon name="map-pin" width="13" height="13" /> {exp.location}
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
};

export default Experience;
