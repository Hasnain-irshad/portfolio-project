import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ZoomableImage from '../components/common/ZoomableImage';
import Icon from '../components/common/Icon';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { blogsAPI } from '../services/api';
import { formatLongDate, readingTime } from '../lib/format';
import './BlogsPage.css';
import './BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams();
    const { data, isLive } = usePortfolioData({ trackLive: true });
    const { profile, resume, blogs } = data;

    // Prefer the already-loaded list (snapshot or live); fetch only if missing.
    const fromList = blogs.find((b) => b._id === id) || null;
    // Result of a direct fetch, keyed by id so stale results are ignored.
    const [lookup, setLookup] = useState({ id: null, blog: null });
    const current = lookup.id === id ? lookup : null;
    const blog = fromList || current?.blog || null;
    const status = current && !current.blog ? 'missing' : 'loading';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const needsFetch = !fromList && lookup.id !== id;
    useEffect(() => {
        if (!needsFetch) return undefined;
        let cancelled = false;
        blogsAPI
            .getById(id)
            .then((res) => !cancelled && setLookup({ id, blog: res.data?.data || null }))
            .catch(() => !cancelled && setLookup({ id, blog: null }));
        return () => {
            cancelled = true;
        };
    }, [id, needsFetch]);

    useEffect(() => {
        if (blog?.title) document.title = `${blog.title} — ${profile?.name || 'Writing'}`;
    }, [blog?.title, profile?.name]);

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const share = blog
        ? [
              { label: 'Share on LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
              { label: 'Share on X', icon: 'x', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(pageUrl)}` },
              { label: 'Share on Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
          ]
        : [];

    return (
        <div className="app">
            <Header profile={profile} resume={resume} />
            <main id="main" className="page">
                {!blog ? (
                    <section className="container page-hero">
                        <Link to="/blogs" className="link-arrow page-hero__back">
                            <Icon name="arrow-left" /> All writing
                        </Link>
                        <h1 className="page-hero__title">
                            {status === 'missing' && isLive ? (
                                <>
                                    Article <em>not found</em>.
                                </>
                            ) : (
                                <>
                                    Loading <em>article</em>…
                                </>
                            )}
                        </h1>
                    </section>
                ) : (
                    <article className="article">
                        <header className="container article__head">
                            <Link to="/blogs" className="link-arrow page-hero__back">
                                <Icon name="arrow-left" /> All writing
                            </Link>
                            <div className="article__meta">
                                <time className="meta" dateTime={blog.publishDate || blog.createdAt}>
                                    {formatLongDate(blog.publishDate || blog.createdAt)}
                                </time>
                                {blog.content && <span className="meta">· {readingTime(blog.content)} min read</span>}
                            </div>
                            <h1 className="article__title">{blog.title}</h1>
                            {blog.excerpt && <p className="article__dek">{blog.excerpt}</p>}
                            {blog.tags?.length > 0 && (
                                <ul role="list" className="chip-list article__tags" aria-label="Tags">
                                    {blog.tags.map((t) => (
                                        <li key={t} className="chip">{t}</li>
                                    ))}
                                </ul>
                            )}
                        </header>

                        {blog.image?.url && (
                            <div className="container article__cover-wrap">
                                <div className="article__cover">
                                    <ZoomableImage src={blog.image.url} alt={blog.title} eager widths={[800, 1200, 1600]} sizes="(max-width: 1240px) 100vw, 1200px" />
                                </div>
                            </div>
                        )}

                        <div className="container">
                            <div className="prose">
                                <ReactMarkdown>{blog.content}</ReactMarkdown>
                            </div>

                            {blog.document?.url && (
                                <aside className="article__attachment">
                                    <p className="meta">Attachment</p>
                                    <a className="link-arrow" href={blog.document.url} target="_blank" rel="noopener noreferrer">
                                        <Icon name="download" /> {blog.document.originalName || 'Download supplementary document'}
                                    </a>
                                </aside>
                            )}

                            <footer className="article__foot">
                                <span className="meta">Share</span>
                                <ul role="list" className="article__share">
                                    {share.map((s) => (
                                        <li key={s.icon}>
                                            <a className="icon-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                                <Icon name={s.icon} />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </footer>
                        </div>
                    </article>
                )}
            </main>
            <Footer profile={profile} />
        </div>
    );
};

export default BlogDetails;
