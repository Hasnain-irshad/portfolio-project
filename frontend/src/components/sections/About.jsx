import React from 'react';
import SectionHeader from '../common/SectionHeader';
import Icon from '../common/Icon';
import './About.css';

const About = ({ index, profile, stats = [] }) => {
    if (!profile) return null;
    const shown = stats.filter((s) => s.value > 0);

    return (
        <section id="about" className="sec about" aria-labelledby="about-title">
            <div className="container">
                <SectionHeader
                    id="about-title"
                    index={index}
                    eyebrow="About"
                    title={
                        <>
                            Engineer, researcher, <em>builder</em>.
                        </>
                    }
                />

                <div className="bento">
                    <article className="tile span-2 about__bio reveal">
                        <p className="about__text">{profile.bio}</p>
                    </article>

                    <aside className="tile about__contact reveal" style={{ '--reveal-delay': '80ms' }} aria-label="Contact details">
                        <p className="meta about__label">Reach me</p>
                        <ul role="list" className="about__list">
                            {profile.location && (
                                <li>
                                    <Icon name="map-pin" />
                                    <span>{profile.location}</span>
                                </li>
                            )}
                            {profile.email && (
                                <li>
                                    <Icon name="mail" />
                                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                                </li>
                            )}
                            {profile.phone && (
                                <li>
                                    <Icon name="phone" />
                                    <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
                                </li>
                            )}
                        </ul>
                    </aside>

                    {shown.length > 0 && (
                        <dl className="tile span-3 about__stats reveal" style={{ '--reveal-delay': '120ms' }}>
                            {shown.map((s) => (
                                <div key={s.label} className="about__stat">
                                    <dt className="meta">{s.label}</dt>
                                    <dd>
                                        {String(s.value).padStart(2, '0')}
                                        {s.suffix && <span className="about__stat-suffix">{s.suffix}</span>}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </div>
        </section>
    );
};

export default About;
