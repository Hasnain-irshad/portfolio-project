import React from 'react';
import SectionHeader from '../common/SectionHeader';
import ZoomableImage from '../common/ZoomableImage';
import Icon from '../common/Icon';
import { formatMonthYear } from '../../lib/format';
import './CurrentlyDoing.css';

const CurrentlyDoing = ({ index, activities }) => {
    if (!activities?.length) return null;

    return (
        <section id="activities" className="sec now" aria-labelledby="now-title">
            <div className="container">
                <SectionHeader
                    id="now-title"
                    index={index}
                    eyebrow="Now"
                    title={
                        <>
                            What I&rsquo;m <em>working on</em>.
                        </>
                    }
                />

                <ul role="list" className={`bento ${activities.length % 2 === 0 ? 'bento--2' : ''}`}>
                    {activities.map((a, i) => (
                        <li key={a._id} className="tile now__item reveal" style={{ '--reveal-delay': `${(i % 3) * 70}ms` }}>
                            {a.image?.url && (
                                <div className="now__media">
                                    <ZoomableImage src={a.image.url} alt={a.title} widths={[480, 800]} sizes="(max-width: 640px) 100vw, 560px" />
                                </div>
                            )}
                            <div className="now__top">
                                {a.current ? (
                                    <span className="chip chip--accent chip--mono">
                                        <span className="status-dot" aria-hidden="true" /> In progress
                                    </span>
                                ) : (
                                    <span className="chip chip--mono">Paused</span>
                                )}
                                {a.startDate && <span className="meta">Since {formatMonthYear(a.startDate)}</span>}
                            </div>
                            <h3 className="now__title">{a.title}</h3>
                            {a.role && <p className="now__role">{a.role}</p>}
                            {a.description && <p className="now__desc">{a.description}</p>}
                            {a.document?.url && (
                                <a className="link-arrow now__doc" href={a.document.url} target="_blank" rel="noopener noreferrer">
                                    <Icon name="paperclip" /> {a.document.originalName || 'Attachment'}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default CurrentlyDoing;
