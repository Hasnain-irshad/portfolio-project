import React from 'react';
import Icon from '../common/Icon';
import { cld } from '../../lib/media';
import { firstSentence } from '../../lib/format';
import { resumeUrl, socialLinks } from '../../lib/links';
import './Hero.css';

const splitTitle = (title = '') => {
    const [role, ...rest] = title.split('|').map((s) => s.trim());
    return { role, focus: rest.join(' · ') };
};

const Hero = ({ profile, resume, experience = [], education = [], activities = [] }) => {
    const name = profile?.name || 'Your Name';
    const parts = name.trim().split(/\s+/);
    const last = parts.length > 1 ? parts.pop() : '';
    const first = parts.join(' ');

    const { role, focus } = splitTitle(profile?.title);
    const lede = firstSentence(profile?.bio || '');
    const cv = resumeUrl(resume);
    const socials = socialLinks(profile);

    const nowActivity = activities.find((a) => a.current);
    const currentRole = experience.find((e) => e.current);
    const topEducation = education.find((e) => e.grade) || education[0];

    const facts = [
        profile?.location && { k: 'Based in', v: profile.location },
        focus && { k: 'Focus', v: focus },
        currentRole && { k: 'Now', v: `${currentRole.position} · ${currentRole.company}` },
        topEducation && {
            k: 'Education',
            v: [topEducation.degree, topEducation.grade && `GPA ${topEducation.grade}`].filter(Boolean).join(' · '),
        },
    ].filter(Boolean);

    const portrait = profile?.profileImage?.url;
    const bgImage = profile?.backgroundImage?.url;

    return (
        <section id="home" className="hero" aria-labelledby="hero-title">
            <div className="hero__bg" aria-hidden="true">
                {bgImage && <div className="hero__photo" style={{ backgroundImage: `url(${cld(bgImage, { w: 1600 })})` }} />}
                <div className="hero__grid" />
            </div>

            <div className="container hero__inner">
                <div className="hero__copy">
                    {(nowActivity || role) && (
                        <p className="hero__status">
                            <span className="status-dot" aria-hidden="true" />
                            <span className="meta">{nowActivity ? 'Currently' : 'Role'}</span>
                            <span className="hero__status-text">{nowActivity ? nowActivity.title : role}</span>
                        </p>
                    )}

                    <h1 id="hero-title" className="hero__name">
                        {first && <span>{first} </span>}
                        <em>{last || first}</em>
                    </h1>

                    {role && <p className="hero__role">{role}</p>}
                    {lede && <p className="hero__lede">{lede}</p>}

                    <div className="hero__actions">
                        <a className="btn btn--primary" href="#projects">
                            View selected work
                            <Icon name="arrow-right" />
                        </a>
                        {cv && (
                            <a className="btn btn--ghost" href={cv} target="_blank" rel="noopener noreferrer">
                                Résumé
                                <Icon name="arrow-up-right" />
                            </a>
                        )}
                    </div>

                    {(socials.length > 0 || profile?.email) && (
                        <ul role="list" className="hero__social" aria-label="Elsewhere">
                            {socials.map((s) => (
                                <li key={s.key}>
                                    <a className="icon-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                        <Icon name={s.icon} />
                                    </a>
                                </li>
                            ))}
                            {profile?.email && (
                                <li>
                                    <a className="icon-btn" href={`mailto:${profile.email}`} aria-label={`Email ${name}`}>
                                        <Icon name="mail" />
                                    </a>
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                <aside className="hero__card glass" aria-label="Profile summary">
                    {portrait && (
                        <div className="hero__portrait">
                            <img
                                src={cld(portrait, { w: 720 })}
                                alt={`Portrait of ${name}`}
                                width="720"
                                height="900"
                                fetchPriority="high"
                                decoding="async"
                            />
                        </div>
                    )}
                    {facts.length > 0 && (
                        <dl className="hero__facts">
                            {facts.map((f) => (
                                <div key={f.k} className="hero__fact">
                                    <dt className="meta">{f.k}</dt>
                                    <dd>{f.v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </aside>
            </div>
        </section>
    );
};

export default Hero;
