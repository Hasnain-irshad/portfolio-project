import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import Icon from '../common/Icon';
import { useActiveSection } from '../../hooks/useActiveSection';
import { initials, resumeUrl } from '../../lib/links';
import './Header.css';

const DEFAULT_NAV = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'blogs', label: 'Writing' },
    { id: 'contact', label: 'Contact' },
];

const Header = ({ profile, resume, nav = DEFAULT_NAV }) => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    // The menu is "open on" a specific path, so navigating closes it
    // automatically — no state-syncing effect needed.
    const [openOn, setOpenOn] = useState(null);
    const open = openOn === location.pathname;
    const setOpen = useCallback(
        (next) =>
            setOpenOn((cur) => {
                const isOpen = cur === location.pathname;
                const value = typeof next === 'function' ? next(isOpen) : next;
                return value ? location.pathname : null;
            }),
        [location.pathname]
    );
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const toggleRef = useRef(null);
    const onHome = location.pathname === '/';

    const active = useActiveSection(
        nav.map((n) => n.id),
        onHome
    );

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // After navigating home from another page, scroll to the requested section.
    useEffect(() => {
        const id = location.state?.scrollTo;
        if (onHome && id) {
            requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
            window.history.replaceState({}, document.title);
        }
    }, [location, onHome]);

    // Close the mobile menu on Escape / route change; return focus to the toggle.
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        menuRef.current?.querySelector('a')?.focus();
        return () => document.removeEventListener('keydown', onKey);
    }, [open, setOpen]);


    const goTo = useCallback(
        (e, id) => {
            setOpen(false);
            if (onHome) {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                window.history.replaceState(null, '', `#${id}`);
            } else {
                e.preventDefault();
                navigate('/', { state: { scrollTo: id } });
            }
        },
        [onHome, navigate, setOpen]
    );

    const cv = resumeUrl(resume);
    const name = profile?.name || 'Portfolio';

    return (
        <header className={`site-header ${scrolled || open ? 'is-scrolled' : ''}`}>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <div className="container site-header__inner">
                <Link to="/" className="brand">
                    <span className="brand__mark" aria-hidden="true">
                        {initials(name)}
                        <span className="brand__dot" />
                    </span>
                    <span className="brand__name">{name}</span>
                </Link>

                <nav className="site-nav" aria-label="Primary">
                    <ul role="list" className="site-nav__list">
                        {nav.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`/#${item.id}`}
                                    onClick={(e) => goTo(e, item.id)}
                                    className={`site-nav__link ${active === item.id ? 'is-active' : ''}`}
                                    aria-current={active === item.id ? 'true' : undefined}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="site-header__actions">
                    {cv && (
                        <a className="btn btn--ghost btn--sm site-header__cv" href={cv} target="_blank" rel="noopener noreferrer">
                            Résumé
                            <Icon name="arrow-up-right" />
                        </a>
                    )}
                    <ThemeToggle />
                    <button
                        ref={toggleRef}
                        type="button"
                        className="icon-btn site-header__menu-btn"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Icon name={open ? 'close' : 'menu'} />
                    </button>
                </div>
            </div>

            <div id="mobile-menu" ref={menuRef} className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
                <nav className="container" aria-label="Mobile">
                    <ul role="list" className="mobile-menu__list">
                        {nav.map((item, i) => (
                            <li key={item.id}>
                                <a href={`/#${item.id}`} onClick={(e) => goTo(e, item.id)} className="mobile-menu__link">
                                    <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {cv && (
                        <a className="btn btn--primary mobile-menu__cv" href={cv} target="_blank" rel="noopener noreferrer">
                            View résumé
                            <Icon name="arrow-up-right" />
                        </a>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
