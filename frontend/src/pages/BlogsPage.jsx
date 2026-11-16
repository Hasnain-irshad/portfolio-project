import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostList from '../components/common/PostList';
import Icon from '../components/common/Icon';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useReveal } from '../hooks/useReveal';
import './BlogsPage.css';

const BlogsPage = () => {
    const { data, isLive } = usePortfolioData({ trackLive: true });
    const { blogs, profile, resume } = data;

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Writing — ${profile?.name || 'Portfolio'}`;
    }, [profile?.name]);

    useReveal([blogs]);

    const tags = [...new Set(blogs.flatMap((b) => b.tags || []))];

    return (
        <div className="app">
            <Header profile={profile} resume={resume} />
            <main id="main" className="page">
                <section className="page-hero">
                    <div className="container">
                        <Link to="/" className="link-arrow page-hero__back">
                            <Icon name="arrow-left" /> Home
                        </Link>
                        <p className="eyebrow">
                            <span className="eyebrow__index">{String(blogs.length).padStart(2, '0')}</span>
                            <span className="eyebrow__rule" aria-hidden="true" />
                            Articles
                        </p>
                        <h1 className="page-hero__title">
                            Writing on <em>AI systems</em>, data &amp; engineering.
                        </h1>
                        {tags.length > 0 && (
                            <ul role="list" className="chip-list page-hero__tags" aria-label="Topics">
                                {tags.slice(0, 10).map((t) => (
                                    <li key={t} className="chip">{t}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <section className="container page-body" aria-label="All articles">
                    {blogs.length > 0 ? (
                        <PostList posts={blogs} headingLevel={2} />
                    ) : (
                        <div className="page-empty">
                            <p>{isLive ? 'No articles published yet.' : 'Loading articles…'}</p>
                            <Link to="/" className="btn btn--ghost">
                                Back home
                            </Link>
                        </div>
                    )}
                </section>
            </main>
            <Footer profile={profile} />
        </div>
    );
};

export default BlogsPage;
