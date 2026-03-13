import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import { blogsAPI, profileAPI } from '../services/api';
import './BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const [blogRes, profileRes] = await Promise.all([
                    blogsAPI.getById(id),
                    profileAPI.get()
                ]);
                setBlog(blogRes.data.data);
                setProfile(profileRes.data.data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) return <Loading />;
    if (!blog) return (
        <div className="blog-details-error">
            <Header />
            <div className="container">
                <h2>Blog post not found</h2>
                <Link to="/blogs" className="btn btn-primary">Back to Blogs</Link>
            </div>
            <Footer profile={profile} />
        </div>
    );

    return (
        <div className="blog-details-page">
            <Header />
            <main className="blog-details-main">
                <article className="blog-article">
                    <header className="article-header">
                        <div className="container narrow">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Link to="/blogs" className="back-link">
                                    <i className="fas fa-arrow-left"></i> Back to Blogs
                                </Link>
                                <h1 className="article-title">{blog.title}</h1>
                                <div className="article-meta">
                                    <span className="article-date">
                                        <i className="fas fa-calendar"></i> {formatDate(blog.publishDate || blog.createdAt)}
                                    </span>
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="article-tags">
                                            {blog.tags.map((tag, i) => (
                                                <span key={i} className="article-tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </header>

                    {blog.image?.url && (
                        <div className="container">
                            <motion.div
                                className="article-featured-image"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img src={blog.image.url} alt={blog.title} />
                            </motion.div>
                        </div>
                    )}

                    <div className="container narrow">
                        <motion.div
                            className="article-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <ReactMarkdown>{blog.content}</ReactMarkdown>

                            {blog.document?.url && (
                                <div className="article-attachments">
                                    <h3>Attachments</h3>
                                    <a
                                        href={blog.document.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-link"
                                    >
                                        <i className="fas fa-file-download"></i>
                                        {blog.document.originalName || 'Download Supplementary Document'}
                                    </a>
                                </div>
                            )}
                        </motion.div>

                        <footer className="article-footer">
                            <div className="share-section">
                                <span>Share this post:</span>
                                <div className="share-links">
                                    <a href={`https://twitter.com/intent/tweet?text=${blog.title}&url=${window.location.href}`} target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
                                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </article>
            </main>
            <Footer profile={profile} />
        </div>
    );
};

export default BlogDetails;
