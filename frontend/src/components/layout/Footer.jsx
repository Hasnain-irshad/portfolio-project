import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
import { initials, socialLinks } from '../../lib/links';
import './Footer.css';

const Footer = ({ profile }) => {
    const year = new Date().getFullYear();
    const name = profile?.name || 'Portfolio';
    const socials = socialLinks(profile);

    return (
        <footer className="site-footer">
            <div className="container site-footer__inner">
                <div className="site-footer__brand">
                    <span className="brand__mark" aria-hidden="true">
                        {initials(name)}
                        <span className="brand__dot" />
                    </span>
                    <p>
                        © {year} {name}
                        {profile?.location && <span className="site-footer__muted"> · {profile.location}</span>}
                    </p>
                </div>

                <ul role="list" className="site-footer__links">
                    <li><Link to="/blogs">Writing</Link></li>
                    {profile?.email && (
                        <li><a href={`mailto:${profile.email}`}>Email</a></li>
                    )}
                    {socials.map((s) => (
                        <li key={s.key}>
                            <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="site-footer__icon">
                                <Icon name={s.icon} />
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#top" className="site-footer__top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                            Back to top <Icon name="arrow-up-right" />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
